"use client";
import { Input, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { subtitle, title } from "@/components/primitives";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/icons";

const schema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(3, "A senha deve ter pelo menos 3 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      (session?.user.roles[0] == "ADMIN") ? router.push("/") : router.push("/")
    }
  }, [session, status, router]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      // Captura e exibe a mensagem de erro personalizada
      setServerError(result.error === "CredentialsSignin" ? "Usuário ou senha inválidos" : result.error);
      setSuccessMessage(null);
    } else {
      setSuccessMessage("Logado com sucesso!");
      setServerError(null);
      router.push("/profile");
      window.location.reload()
    }

    setLoading(false);
  };

  return (
    <form
      className="w-full h-full flex flex-col gap-5 justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col text-left justify-center gap-2">
        <div>
          <span className="text-3xl lg:text-4xl">Entre com sua&nbsp;</span>
          <span className={title({ color: "violet", size: "sm" })}>
            conta&nbsp;
          </span>
        </div>
        <span className={subtitle()}>
          Faça o login com sua conta para continuar
        </span>
      </div>

      <div>
        <Input
          label="Email"
          placeholder="Digite seu email"
          variant="underlined"
          {...register("email")}
          isInvalid={!!errors.email}
          size="lg"
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1 ml-2">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="w-full">
        <Input
          label="Senha"
          placeholder="Digite sua senha"
          variant="underlined"
          {...register("password")}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </button>
          }
          isInvalid={!!errors.password}
          size="lg"
          type={isVisible ? "text" : "password"}
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1 ml-2">
            {errors.password.message}
          </span>
        )}
      </div>

      {serverError && (
        <span className="text-red-500 text-sm mt-1">{serverError}</span>
      )}
      {successMessage && (
        <span className="text-green-500 text-sm mt-1">{successMessage}</span>
      )}

      <div className="w-full">
        <Button
          className="w-full flex items-center justify-center"
          color="primary"
          disabled={loading}
          size="md"
          type="submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </div>


      <div className="w-full text-center">
        Esqueceu sua senha? Clique {" "}
        <NextLink
          className="data-[active=true]:text-primary data-[active=true]:font-large text-primary"
          href={"/Password/forget"}
        >
          aqui
        </NextLink>
      </div>

      
    </form>
  );
}
