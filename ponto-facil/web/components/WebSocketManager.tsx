"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketManager = () => {
  const { data: session, status } = useSession();
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Configuração do WebSocket
      const socket = new SockJS("http://localhost:8081/ws");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("WebSocket Debug:", str),
        onConnect: () => {
          console.log("Conectado ao WebSocket!");

          // Publica o username no tópico /app/status
          const username =  session.user.username || "Desconhecido";
          stompClient.publish({
            destination: "/app/status",
            body: JSON.stringify({ username: username, status: "active" }),
          });
          console.log(`Username ${username} enviado ao servidor como ativo via WebSocket.`);
        },
        onStompError: (frame) => {
          console.error("Erro no WebSocket:", frame.headers["message"]);
        },
      });

      // Salva o cliente na ref para controle posterior
      stompClientRef.current = stompClient;
      stompClient.activate();

      return () => {
        // Limpa a conexão ao desmontar
        stompClient.deactivate();
        stompClientRef.current = null;
      };
    }

  }, [session, status]);

  return null; // Componente apenas gerencia o WebSocket e não renderiza nada
};

export default WebSocketManager;
