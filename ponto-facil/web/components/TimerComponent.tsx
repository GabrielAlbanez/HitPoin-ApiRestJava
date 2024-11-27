"use client";

import React, { useState, useEffect } from "react";

export const TimerComponent = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
      hour12: false,
    }).format(time);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "30px",
        textAlign: "center",
      }}
    >
      {formatTime(time)}
    </div>
  );
};
