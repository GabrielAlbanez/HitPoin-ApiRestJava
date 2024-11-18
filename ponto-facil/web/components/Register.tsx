"use client";
import { Checkbox, Input, Button } from "@nextui-org/react";
import { useState } from "react";
import NextLink from "next/link";
import { useForm, SubmitHandler, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { title, subtitle } from "@/components/primitives";
import { EyeSlashFilledIcon, EyeFilledIcon } from "@/components/icons";
import { useSession } from "next-auth/react";

const schema = z.object({
  username: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Formato de email inválido"),
  cargo: z.string().min(1, "Campo obrigatório"),
  cargaHoraria: z.string().min(1, "Campo obrigatório"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve concordar com os termos e a política de privacidade",
  }),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: session } = useSession();
  const token = session?.user?.token;

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      console.log("Valores do formulário:", data);


      const response = await fetch(
        "http://localhost:8081/usuarios/CreateUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const responseData = await response.json();
      console.log("Usuário criado com sucesso:", responseData);

      responseData!.response !== "usuario criado com sucesso"
        ? setServerError(responseData!.response)
        : setSuccessMessage(responseData.response);
    } catch (error) {
      // Captura a mensagem do erro se for um objeto Error
      setServerError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="container w-full h-full flex flex-col gap-5 py-4 justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col text-left justify-center gap-2">
        <div>
          <span className="text-3xl lg:text-4xl">Crie uma nova&nbsp;</span>
          <span
            className={title({
              color: "violet",
              size: "sm",
            })}
          >
            conta&nbsp;
          </span>
        </div>

        <span className={subtitle()}>Cadastrer uma nova conta!</span>
      </div>
      <div className="flex flex-col justify-center h-full w-full gap-4">
        <InputField
          error={errors.username}
          label="Nome"
          register={register("username")}
          type="text"
        />
        <InputField
          error={errors.email}
          label="Email"
          register={register("email")}
          type="email"
        />
        <InputField
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
          error={errors.password}
          label="Senha"
          register={register("password")}
          type={isVisible ? "text" : "password"}
        />
        <InputField
          error={errors.cargo}
          label="Cargo"
          register={register("cargo")}
          type="text"
        />
        <InputField
          error={errors.cargaHoraria}
          label="Carga Horaria"
          register={register("cargaHoraria")}
          type="text"
        />
        <CheckboxField
          error={errors.agreeToTerms}
          register={register("agreeToTerms")}
        />
        {serverError && (
          <span className="text-red-500 text-sm mt-1">{serverError}</span>
        )}
        {successMessage && (
          <span className="text-green-500 text-sm mt-1">{successMessage}</span>
        )}
        <Button
          className="w-full"
          color="primary"
          disabled={loading}
          size="md"
          type="submit"
        >
          {loading ? "Registrando..." : "Criar Conta"}
        </Button>
      </div>
    </form>
  );
}

interface InputFieldProps {
  label: string;
  type: string;
  register: ReturnType<UseFormRegister<FormData>>;
  error?: { message?: string };
  endContent?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  register,
  error,
  endContent,
}) => (
  <div className="w-full text-left">
    <Input
      label={label}
      placeholder={`Digite seu ${label.toLowerCase()}`}
      type={type}
      variant="underlined"
      {...register}
      endContent={endContent}
      isInvalid={!!error}
      size="lg"
    />
    {error && (
      <span className="text-red-500 text-sm mt-1 ml-2">{error.message}</span>
    )}
  </div>
);

interface CheckboxFieldProps {
  register: ReturnType<UseFormRegister<FormData>>;
  error?: { message?: string };
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ register, error }) => (
  <div className="flex items-center flex-col">
    <Checkbox {...register} size="sm">
      Eu concordo com os termos e a política de privacidade
    </Checkbox>
    {error && (
      <span className="text-red-500 text-sm mt-1 ml-2">{error.message}</span>
    )}
  </div>
);
