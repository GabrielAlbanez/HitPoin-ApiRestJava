// next-auth.d.ts
import NextAuth from "next-auth";

// Extende o tipo padrão da sessão
declare module "next-auth" {
  interface Session {
    user: {
      username: string | unknown;
      email: string | unknown;
      token: string | unknown;
      isAdmin: boolean | unknown; // Adicionada a propriedade `isAdmin`
      roles: string[] | unknown;
      cargaHoraria: string | unknown;
      cargo: string | unknown;
      imagePath: string | unknown;
    };
  }

  interface User {
    token: string;
    isAdmin: boolean; // Certifique-se de que `User` também contenha `isAdmin`
  }

  interface JWT {
    accessToken: string;
    username: string;
    email: string;
    isAdmin: boolean;
    roles: string[];
    cargaHoraria: string;
    cargo: string;
    imagePath: string;
  }
}
