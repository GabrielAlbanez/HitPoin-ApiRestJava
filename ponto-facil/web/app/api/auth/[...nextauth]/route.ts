// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials) {
        try {
          const loginResponse = await axios.post("http://localhost:8081/auth/Login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { acessToken, response } = loginResponse.data;

          if (acessToken) {
            return { token: acessToken };
          } else {
            throw new Error(response || "Erro de autenticação");
          }
        } catch (error: any) {
          const backendMessage = error.response?.data?.response;
          throw new Error(backendMessage || "Erro durante autenticação");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Se o usuário acabou de fazer login, ou se estamos disparando um `update`, buscar dados do perfil
      if (user?.token || (trigger === "update" && token.accessToken)) {
        const accessToken = user?.token || token.accessToken;

        try {
          const profileResponse = await axios.get("http://localhost:8081/auth/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const profileData = profileResponse.data;
          token.accessToken = accessToken;
          token.username = profileData.username;
          token.email = profileData.email;
          token.roles = profileData.roles;
          token.cargaHoraria = profileData.cargaHoraria;
          token.cargo = profileData.cargo;
          token.imagePath = profileData.imagePath;
        } catch (error) {
          console.error("Erro ao obter o perfil do usuário:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Configura a sessão com os dados do token
      session.user = {
        username: token.username,
        email: token.email,
        token: token.accessToken,
        roles: token.roles,
        cargaHoraria: token.cargaHoraria,
        cargo: token.cargo,
        imagePath: token.imagePath,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};

// Exportações para GET e POST
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
