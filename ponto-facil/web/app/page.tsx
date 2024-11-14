"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  useDisclosure 
} from "@nextui-org/react";

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

export default function Home() {
  const { data: session, status } = useSession() as { data: UserSession; status: string };
  const router = useRouter();
  
  const [pontoData, setPontoData] = useState<PontoData>({
    entrada: null,
    pausa: null,
    retorno: null,
    saida: null,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Controle do modal
  const [modalMessage, setModalMessage] = useState<string>(""); // Estado para a mensagem do modal

  useEffect(() => {
    if (status === "loading") return;
  }, [session, status, router]);

  // Função para clicar no card de ponto
  const handleCardClick = async (tipoPonto: keyof PontoData) => {
    // Verifica se o usuário é "ADMIN" e abre o modal
    if (session?.user?.roles[0] === "ADMIN") {
      setModalMessage("Usuários com o papel de 'ADMIN' não têm permissão para bater ponto.");
      onOpen();
      return;
    }

    // Verifica se o ponto já foi batido
    if (pontoData[tipoPonto]) {
      setModalMessage(`Você já registrou o ponto de ${tipoPonto}.`);
      onOpen();
      return;
    }

    try {
      const pontoRequestData = { tipoPonto };
      console.log("Requisição para o backend com:", pontoRequestData);

      const response = await axios.post<PontoResponse>(
        "http://localhost:8081/usuarios/HitPoint",
        pontoRequestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );

      console.log("Resposta do backend:", response.data);
      
      setPontoData((prevData) => ({
        ...prevData,
        [tipoPonto]: response.data.ponto,
      }));
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <section className="flex flex-wrap justify-center gap-6 py-8 md:py-10">
      {/* Modal de aviso */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Atenção</ModalHeader>
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

      <div className="flex flex-col gap-4">
        {/* Card de Entrada */}
        <Card className="py-4 bg-gray-700 text-white max-w-sm flex-shrink-0 shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">1</p>
            <h4 className="font-bold text-lg">Bater Ponto</h4>
            {pontoData.entrada && (
              <>
                <p>Tipo de ponto: {pontoData.entrada.tipoPonto}</p>
                <p>Hora: {pontoData.entrada.hora}</p>
                <p>Data: {pontoData.entrada.dia}/{pontoData.entrada.mes}</p>
              </>
            )}
          </CardHeader>
          <CardBody
            className="overflow-visible py-2 cursor-pointer"
            onClick={() => handleCardClick("entrada")}
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="" // Adicione a URL da imagem
              width={270}
            />
          </CardBody>
        </Card>

        {/* Card de Pausa */}
        <Card className="py-4 text-white bg-blue-400 max-w-sm flex-shrink-0 shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">2</p>
            <h4 className="font-bold text-lg">PAUSA</h4>
            {pontoData.pausa && (
              <>
                <p>Tipo de ponto: {pontoData.pausa.tipoPonto}</p>
                <p>Hora: {pontoData.pausa.hora}</p>
                <p>Data: {pontoData.pausa.dia}/{pontoData.pausa.mes}</p>
              </>
            )}
          </CardHeader>
          <CardBody
            className="overflow-visible py-2 cursor-pointer"
            onClick={() => handleCardClick("pausa")}
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="" // Adicione a URL da imagem
              width={270}
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        {/* Card de Retorno */}
        <Card className="py-4 text-white bg-yellow-500 max-w-sm flex-shrink-0 shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">3</p>
            <h4 className="font-bold text-lg">RETORNO</h4>
            {pontoData.retorno && (
              <>
                <p>Tipo de ponto: {pontoData.retorno.tipoPonto}</p>
                <p>Hora: {pontoData.retorno.hora}</p>
                <p>Data: {pontoData.retorno.dia}/{pontoData.retorno.mes}</p>
              </>
            )}
          </CardHeader>
          <CardBody
            className="overflow-visible py-2 cursor-pointer"
            onClick={() => handleCardClick("retorno")}
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="" // Adicione a URL da imagem
              width={270}
            />
          </CardBody>
        </Card>

        {/* Card de Saída */}
        <Card className="py-4 text-white bg-orange-600 max-w-sm flex-shrink-0 shadow-lg transition-transform duration-200 hover:scale-105 rounded-lg">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">4</p>
            <h4 className="font-bold text-lg">SAÍDA</h4>
            {pontoData.saida && (
              <>
                <p>Tipo de ponto: {pontoData.saida.tipoPonto}</p>
                <p>Hora: {pontoData.saida.hora}</p>
                <p>Data: {pontoData.saida.dia}/{pontoData.saida.mes}</p>
              </>
            )}
          </CardHeader>
          <CardBody
            className="overflow-visible py-2 cursor-pointer"
            onClick={() => handleCardClick("saida")}
          >
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="" // Adicione a URL da imagem
              width={270}
            />
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
