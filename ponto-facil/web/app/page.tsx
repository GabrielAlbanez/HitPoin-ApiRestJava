"use client";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
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
  if (!value || value.trim() === "") return;
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
  const [isPending, startTransition] = useTransition();
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

  const checkPointOrder = (tipoPonto: keyof PontoData): boolean => {
    if (tipoPonto === "entrada") return true;
    if (tipoPonto === "pausa" && pontoData.entrada) return true;
    if (tipoPonto === "retorno" && pontoData.pausa) return true;
    if (tipoPonto === "saida" && pontoData.retorno) return true;
    return false;
  };

  const handleCardClick = (tipoPonto: keyof PontoData) => {
    if (isProcessing || loadingType === tipoPonto) return;

    setIsProcessing(true);

    startTransition(async () => {
      setLoadingType(tipoPonto);

      if (!checkPointOrder(tipoPonto)) {
        setModalMessage(
          "Por favor, siga a ordem correta: Entrada -> Pausa -> Retorno -> Saída."
        );
        onOpen();
        setLoadingType(null);
        setIsProcessing(false);
        return;
      }

      try {
        const response = await axios.post<PontoResponse>(
          "https://hitpoint-backend-latest.onrender.com/usuarios/HitPoint",
          { tipoPonto },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
          }
        );

        const novoPonto = response.data.ponto;
        setPontoData((prevData) => {
          const updatedData = { ...prevData, [tipoPonto]: novoPonto };
          setCookie("pontosBatidos", JSON.stringify(updatedData));
          return updatedData;
        });
      } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        setModalMessage(
          "Ocorreu um erro ao registrar o ponto. Tente novamente."
        );
        onOpen();
      } finally {
        setLoadingType(null);
        setIsProcessing(false);
      }
    });
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
        className={`py-4 min-w-[300px] min-h-[150px] max-w-[400px] max-h-[200px] flex-shrink-0 shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg ${bgColor} ${
          isClicked || loadingType === tipoPonto || isProcessing
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
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
          {loadingType === tipoPonto && <div className="loader"></div>}
        </CardBody>
      </Card>
    );
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center gap-7 md:gap-2">
      <TimerComponent />
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[90%] mx-auto py-10">
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
