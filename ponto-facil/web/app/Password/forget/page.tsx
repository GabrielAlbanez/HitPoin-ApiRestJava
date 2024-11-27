"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";

const schemaPasswordReset = z.object({
    email: z.string().email("Formato de email inválido"),
});

type FormData = z.infer<typeof schemaPasswordReset>;

const ForgetPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schemaPasswordReset),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        setServerError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("https://hitpoint-backend-latest.onrender.com/usuarios/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            // Captura a resposta do corpo como texto
            const responseText = await response.text();
            console.log("Resposta da API forgot-password:", responseText);

           if (response.ok && responseText) {
                if (responseText == Link de redefinição de senha enviado para o e-mail: ${data.email}) {
                    setSuccessMessage(responseText);
                }  else{
                    setServerError(responseText);
                }
            } else if (response.status === 401) {
                setServerError(responseText || "Acesso Negado");
            } else {
                setServerError(responseText || "Ocorreu um erro ao tentar enviar o link. Tente novamente.");
            }
        } catch (error) {
            setServerError("Erro de conexão. Por favor, tente novamente.");
        }

        setLoading(false);
    };

    return (
        <form
            className="w-full h-full flex flex-col gap-5 justify-center items-center"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h1 className="text-3xl lg:text-4xl">Redefinir Senha</h1>
            <p>Digite seu e-mail para receber o link de redefinição de senha.</p>

            <div className="w-full">
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

            {serverError && (
                <span className="text-red-500 text-sm mt-1">{serverError}</span>
            )}
            {successMessage && (
                <span className="text-green-500 text-sm mt-1">{successMessage}</span>
            )}

            <Button
                className="w-full flex items-center justify-center mt-4"
                color="primary"
                disabled={loading}
                size="md"
                type="submit"
            >
                {loading ? "Enviando..." : "Enviar Link"}
            </Button>
        </form>
    );
};

export default ForgetPassword;
