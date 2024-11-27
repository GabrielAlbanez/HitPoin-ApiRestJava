"use client";

import React, { useState, useEffect } from "react";

export const TimerComponent = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

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
    <div className="flex flex-col items-center justify-center ">
      <h2 className="text-xl font-bold text-gray-300">Horário Atual</h2>
      <div className="bg-gray-800 text-white font-mono text-3xl py-4 px-8 rounded-lg shadow-lg mt-4">
        {formatTime(time)}
      </div>
    </div>
  );
};
