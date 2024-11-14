// types/next-auth.d.ts
import { DefaultUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User extends DefaultUser {
    isAdmin: boolean; // Adicione isAdmin aqui
  }

  interface Session {
    user: User; // Use a interface User estendida
  }
}
