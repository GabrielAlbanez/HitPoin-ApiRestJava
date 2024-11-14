// next-auth.d.ts
import NextAuth from "next-auth";

// Extende o tipo padrão da sessão
declare module "next-auth" {
  interface Session {
    user: {
      username: string | unknown;
      email: string | unknown;
      token: string | unknown;
      roles: string[] | unknown;
      cargaHoraria: string | unknown;
      cargo: string | unknown;
      imagePath : string | unknown
    };
  }

  interface User {
    token: string;
  }

  interface JWT {
    accessToken: string;
    username: string;
    email: string;
    roles: string[];
    cargaHoraria: string;
    cargo: string;
    imagePath : string
  }
}
