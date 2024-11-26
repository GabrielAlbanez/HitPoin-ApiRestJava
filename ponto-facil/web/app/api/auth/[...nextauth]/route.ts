// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Tipagem personalizada para o usuário retornado
interface CustomUser {
  id: string;
  email: string;
  username: string;
  token: string;
  isAdmin: boolean;
  roles?: string[];
  cargaHoraria?: string;
  cargo?: string;
  imagePath?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email e senha são obrigatórios.");
          }

          // Login para obter o token inicial
          const loginResponse = await axios.post("https://hitpoint-backend-latest.onrender.com/auth/Login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { acessToken, response } = loginResponse.data;

          if (!acessToken) {
            throw new Error(response || "Falha na autenticação");
          }

          // Obter informações detalhadas do perfil com o token
          const profileResponse = await axios.get("https://hitpoint-backend-latest.onrender.com/auth/profile", {
            headers: { Authorization: `Bearer ${acessToken}` },
          });

          const profileData = profileResponse.data;

          return {
            id: profileData.id,
            email: profileData.email,
            username: profileData.username,
            token: acessToken,
            isAdmin: profileData.isAdmin || false,
            roles: profileData.roles,
            cargaHoraria: profileData.cargaHoraria,
            cargo: profileData.cargo,
            imagePath: profileData.imagePath,
          } as CustomUser;
        } catch (error: any) {
          const backendMessage = error.response?.data?.response || "Erro durante a autenticação";
          throw new Error(backendMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const customUser = user as CustomUser;
        token.accessToken = customUser.token;
        token.id = customUser.id;
        token.email = customUser.email;
        token.username = customUser.username;
        token.isAdmin = customUser.isAdmin;
        token.roles = customUser.roles;
        token.cargaHoraria = customUser.cargaHoraria;
        token.cargo = customUser.cargo;
        token.imagePath = customUser.imagePath;
      }

      // Lógica para atualização da sessão
      if (trigger === "update" && token.accessToken) {
        try {
          const profileResponse = await axios.get("https://hitpoint-backend-latest.onrender.com/auth/profile", {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });

          const profileData = profileResponse.data;
          token.username = profileData.username;
          token.email = profileData.email;
          token.roles = profileData.roles;
          token.cargaHoraria = profileData.cargaHoraria;
          token.cargo = profileData.cargo;
          token.imagePath = profileData.imagePath;
        } catch (error) {
          console.error("Erro ao atualizar dados da sessão:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        username: token.username,
        email: token.email,
        token: token.accessToken,
        isAdmin: token.isAdmin,
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
