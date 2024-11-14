// app/api/upload/route.ts

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  // Obtenha a sessão do usuário autenticado
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extraia o arquivo do formData
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Faça a requisição para o backend Spring para upload da imagem
  const response = await fetch("http://localhost:8081/usuarios/imageUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    body: formData,
  });

  // Verifica se a resposta foi bem-sucedida
  if (!response.ok) {
    const errorText = await response.text(); // Leia o texto do erro para melhor debug
    return NextResponse.json({ error: "Failed to upload image", details: errorText }, { status: response.status });
  }

  // Parse da resposta do backend (assumindo que retorna JSON com o caminho da imagem)
  const data = await response.json();

  // Verifique se o backend retornou o caminho da imagem
  if (!data || !data.imagePath) {
    return NextResponse.json({ error: "Image path not returned from server" }, { status: 500 });
  }

  console.log("data da req imagePath",data.imagePath)

  // Atualize a sessão do usuário com o novo caminho da imagem

  return NextResponse.json({ message: "Image uploaded successfully", imagePath: data.imagePath });
}
