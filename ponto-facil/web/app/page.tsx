"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { TimerComponent } from "@/components/TimerComponent";

// Tipos para dados de ponto individual
interface PontoDataItem {
  tipoPonto: string;
  hora: string;
  dia: string;
  mes: string;
}

// Tipo para o estado de pontoData
interface PontoData {
  entrada: PontoDataItem | null;
  pausa: PontoDataItem | null;
  retorno: PontoDataItem | null;
  saida: PontoDataItem | null;
}

// Tipagem para as propriedades da sessão do usuário
interface UserSession {
  user: {
    token: string;
    roles: string[];
  };
}

// Tipagem para as respostas de dados da API
interface PontoResponse {
  ponto: PontoDataItem;
}

// Função para salvar dados nos cookies
const setCookie = (name: string, value: string, days = 7) => {
  if (!value || value.trim() === "") {
    console.error(
      "Tentativa de salvar um cookie com valor vazio ou inválido. Operação cancelada."
    );
    return;
  }

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
};

// Função para recuperar dados dos cookies
const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
  }
  return null;
};

// Função para decodificar e verificar o valor do cookie no console
const logCookieValue = (cookieName: string) => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];

  if (cookieValue) {
    console.log(
      "Cookie Decodificado:",
      JSON.parse(decodeURIComponent(cookieValue))
    );
  } else {
    console.log(`Cookie '${cookieName}' não encontrado.`);
  }
};

export default function Home() {
  const { data: session, status } = useSession() as {
    data: UserSession;
    status: string;
  };

  const [pontoData, setPontoData] = useState<PontoData>({
    entrada: null,
    pausa: null,
    retorno: null,
    saida: null,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalMessage, setModalMessage] = useState<string>("");

  useEffect(() => {
    // Carregar os dados de pontos batidos dos cookies quando o componente for montado
    const storedData = getCookie("pontosBatidos");
    if (storedData) {
      try {
        const parsedData: PontoData = JSON.parse(
          decodeURIComponent(storedData)
        );
        setPontoData(parsedData);
      } catch (error) {
        console.error("Erro ao carregar os dados dos cookies:", error);
      }
    }

    // Logar o valor decodificado do cookie no console
    logCookieValue("pontosBatidos");
  }, []); // Executa apenas uma vez ao montar o componente

  const checkPointOrder = (tipoPonto: keyof PontoData): boolean => {
    if (tipoPonto === "entrada") return true;
    if (tipoPonto === "pausa" && pontoData.entrada) return true;
    if (tipoPonto === "retorno" && pontoData.pausa) return true;
    if (tipoPonto === "saida" && pontoData.retorno) return true;
    return false;
  };

  const handleCardClick = async (tipoPonto: keyof PontoData) => {
    // Verifica se o tipoPonto já está registrado nos cookies
    const storedData = getCookie("pontosBatidos");
    if (storedData) {
      const parsedSessionData: PontoData = JSON.parse(
        decodeURIComponent(storedData)
      );
      if (parsedSessionData[tipoPonto]) {
        setModalMessage(`Você já registrou o ponto de ${tipoPonto}.`);
        onOpen();
        return;
      }
    }

    // Verifica se o usuário é "ADMIN" e abre o modal
    if (session?.user?.roles[0] === "ADMIN") {
      setModalMessage(
        "Usuários com o papel de 'ADMIN' não têm permissão para bater ponto."
      );
      onOpen();
      return;
    }

    // Verifica a ordem dos pontos
    if (!checkPointOrder(tipoPonto)) {
      setModalMessage(
        "Por favor, siga a ordem correta: Entrada -> Pausa -> Retorno -> Saída."
      );
      onOpen();
      return;
    }

    try {
      const pontoRequestData = { tipoPonto };
      const response = await axios.post<PontoResponse>(
        "https://hitpoint-backend-latest.onrender.com/usuarios/HitPoint",
        pontoRequestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      const novoPonto = response.data.ponto;

      // Atualiza o estado e registra o ponto nos cookies
      setPontoData((prevData) => {
        const updatedData = { ...prevData, [tipoPonto]: novoPonto };

        // Atualizar os cookies diretamente no handleCardClick
        setCookie("pontosBatidos", JSON.stringify(updatedData));

        // Logar o valor atualizado do cookie
        logCookieValue("pontosBatidos");

        return updatedData;
      });
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
      setModalMessage("Ocorreu um erro ao registrar o ponto. Tente novamente.");
      onOpen();
    }
  };

  const renderCard = (
    tipoPonto: keyof PontoData,
    label: string,
    bgColor: string
  ) => {
    const ponto = pontoData[tipoPonto];
    const isClicked = !!ponto;

    return (
      <Card
        className={`py-4 max-w-sm flex-shrink-0  shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg ${bgColor}`}
        style={{
          opacity: isClicked ? 0.5 : 1,
          cursor: isClicked ? "not-allowed" : "pointer",
        }}
      >
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{label}</p>
          <h4 className="font-bold text-lg">{tipoPonto.toUpperCase()}</h4>
          {ponto && (
            <>
              <p>Tipo de ponto: {ponto.tipoPonto}</p>
              <p>Hora: {ponto.hora}</p>
              <p>
                Data: {ponto.dia}/{ponto.mes}
              </p>
            </>
          )}
        </CardHeader>
        <CardBody
          className="overflow-visible py-2"
          onClick={() => handleCardClick(tipoPonto)}
        >
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src=""
            width={270}
          />
        </CardBody>
      </Card>
    );
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-7 md:gap-2">
      <TimerComponent/>
      <section className="flex flex-wrap justify-center  max-w-[100%]  gap-6 px-12 md:px-40 md:py-10">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Atenção
                </ModalHeader>
                <ModalBody>
                  <p>{modalMessage}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Fechar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {renderCard("entrada", "1", "bg-gray-700 text-white")}
        {renderCard("pausa", "2", "bg-blue-400 text-white")}
        {renderCard("retorno", "3", "bg-yellow-500 text-white")}
        {renderCard("saida", "4", "bg-orange-600 text-white")}
      </section>
    </div>
  );
}
