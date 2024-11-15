import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Função para decodificar o payload do JWT e obter o exp
function decodeJWT(token) {
  const payloadBase64 = token.split('.')[1];
  const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
  return JSON.parse(payloadDecoded);
}

export async function middleware(req: NextRequest) {
  const signInUrl = new URL("/login", req.url);

  console.log("req",req.nextUrl.pathname)
  // Ignora a verificação nas rotas de login, registro e qualquer chamada que envolva o processo de autenticação
  if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }


  if (req.nextUrl.pathname === "/api/auth/session") {
    return NextResponse.redirect(signInUrl);
  }



  // Obtém o token de sessão do NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token obtido pelo getToken:", token);

  // Se o token não estiver presente, redireciona para a página de login
  if (!token || !token.accessToken) {
    console.log("Token não encontrado ou inválido. Redirecionando para a página de login.");
    return NextResponse.redirect(signInUrl);
  }

  // Decodifica o token JWT para obter o valor de `exp`
  let decodedToken;
  try {
    decodedToken = decodeJWT(token.accessToken);
  } catch (error) {
    console.error("Erro ao decodificar o token JWT:", error);
    return NextResponse.redirect(signInUrl);
  }

  const tokenExp = decodedToken.exp;
  const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos desde a época Unix

  // Exibe os valores de `exp` e `currentTime` para debug
  console.log("Valor de token.exp:", tokenExp);
  console.log("Tempo atual (currentTime):", currentTime);
  console.log("Condição de expiração (token.exp < currentTime):", tokenExp < currentTime);

  // Verifica se o token está expirado
  if (tokenExp && tokenExp < currentTime) {
    console.log("Token expirado. Redirecionando para a tela de login.");

    // Remove os cookies de sessão de autenticação ao redirecionar
    const response = NextResponse.redirect(signInUrl);
    response.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });
    response.cookies.set("next-auth.csrf-token", "", { path: "/", maxAge: 0 });
    return response; // Redireciona para a página de login
  } else {
    console.log("Token ainda é válido.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|login|favicon.ico|public).*)",
  ], // Protege todas as rotas, exceto login, registro, arquivos estáticos e API de autenticação
};
