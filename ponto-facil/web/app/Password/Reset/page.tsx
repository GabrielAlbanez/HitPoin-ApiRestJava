"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const schemaPasswordReset = z.object({
    password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
});

type FormData = z.infer<typeof schemaPasswordReset>;

const ResetPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schemaPasswordReset),
    });

    const router = useRouter();

    useEffect(() => {
        // Extrair o token da URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenParam = urlParams.get("token");
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setServerError("Token inválido ou não encontrado.");
        }
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!token) {
            setServerError("Token inválido ou não encontrado.");
            return;
        }

        setLoading(true);
        setServerError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("https://hitpoint-backend-latest.onrender.com/usuarios/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: data.password }),
            });

            const responseText = await response.text();
            console.log("Resposta da API reset-password:", responseText);

            if (response.ok) {
                setSuccessMessage(responseText);
                router.push("/login")
            } else if (response.status === 400) {
                setServerError(responseText || "Token expirado ou inválido.");
            } else {
                setServerError(responseText || "Ocorreu um erro ao tentar redefinir a senha.");
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
            <p>Digite sua nova senha abaixo.</p>

            <div className="w-full">
                <Input
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                    variant="underlined"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    size="lg"
                    type="password"
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

            <Button
                className="w-full flex items-center justify-center mt-4"
                color="primary"
                disabled={loading}
                size="md"
                type="submit"
            >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
        </form>
    );
};

export default ResetPassword;
