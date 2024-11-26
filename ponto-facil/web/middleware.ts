import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Decodificador de JWT alternativo (compatível com Edge Runtime)
function decodeJWT(token: any) {
  const payloadBase64 = token.split(".")[1];
  const payloadDecoded = atob(payloadBase64);
  return JSON.parse(payloadDecoded);
}

export async function middleware(req: NextRequest) {
  const signInUrl = new URL("/login", req.url);

  console.log("Verificando middleware para:", req.nextUrl.pathname);

  // Rotas públicas ou relacionadas à autenticação
  if (
    ["/login", "/Password/Reset", "/Password/forget", "/api/auth"].some((path) =>
      req.nextUrl.pathname.startsWith(path)
    )
  ) {
    return NextResponse.next();
  }

  // Obtém o token de sessão
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: false });
  console.log("Token obtido pelo middleware:", token);

  if (!token?.accessToken) {
    console.log("Token ausente ou inválido. Redirecionando para login.");
    return NextResponse.redirect(signInUrl);
  }

  // Decodificar e verificar expiração do token
  let decodedToken;
  try {
    decodedToken = decodeJWT(token.accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token expirado. Redirecionando para login.");
      return NextResponse.redirect(signInUrl);
    }
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return NextResponse.redirect(signInUrl);
  }

  console.log("Token válido. Prosseguindo...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|login|register|favicon.ico|public).*)"],
};
