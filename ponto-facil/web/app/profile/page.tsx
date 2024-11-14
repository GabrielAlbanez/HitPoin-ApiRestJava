"use client";

import { useSession } from "next-auth/react";
import {
  Card, CardHeader, CardBody, Avatar, Divider,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure
} from "@nextui-org/react";
import { useState, ChangeEvent, useRef, useTransition } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfile {
  username: string;
  email: string;
  token: string;
  roles: string[];
  cargaHoraria: string;
  cargo: string;
  imagePath: string;
}

const Profile = () => {
  const { data: session, update } = useSession() as { data: { user: UserProfile } | null };
  const [image, setImage] = useState<string>(
    session?.user.imagePath || "https://th.bing.com/th/id/OIP.dC6CwT2I2vj7goUpkPFvVgHaEK?rs=1&pid=ImgDetMain"
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!session) return <div>Carregando...</div>;

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // Cria uma URL de visualização para a imagem selecionada
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedImage) {
      // Exibe o toast de erro caso nenhuma imagem tenha sido selecionada
      toast.error("Nenhuma imagem selecionada", { theme: "colored" });
      return;
    }

    startTransition(async () => {
      // Utilizando o `toast.promise` para gerenciar estados de carregamento, sucesso e erro
      await toast.promise(
        new Promise(async (resolve, reject) => {
          const formData = new FormData();
          formData.append("file", selectedImage);

          try {
            // Simulando um atraso para visualização do estado de carregamento
            await new Promise(res => setTimeout(res));
            
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json() as { message: string; imagePath: string };
              setImage(`http://localhost:8081/api/${data.imagePath}`);
              setSelectedImage(null);
              setPreview(null);
              onOpenChange(false); // Fecha o modal

              // Chama `update()` sem argumento para forçar a atualização da sessão
              await update();

              resolve("Imagem enviada com sucesso!"); // Sucesso
            } else {
              reject("Erro ao enviar a imagem");
            }
          } catch (error) {
            console.error("Erro ao enviar a imagem:", error);
            reject("Erro ao enviar a imagem");
          }
        }),
        {
          pending: "Enviando imagem...",
          success: "Imagem enviada com sucesso!",
          error: "Erro ao enviar a imagem",
          theme: "colored",
        }
      );
    });
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  const handleOpenFileInput = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className="flex justify-center items-center min-h-full">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />

      <Card className="w-full max-w-xl md:max-w-lg lg:max-w-2xl shadow-xl border-[1px] border-purple-500 rounded-3xl p-8 bg-slate-900 text-white">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <Avatar
            isBordered
            color="secondary"
            size="xl"
            src={session?.user?.imagePath ? `http://localhost:8081/api/${session.user.imagePath}` : image}
            alt="User Avatar"
            className="w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full border-4 border-white"
            onClick={onOpen} // Abre o modal ao clicar na imagem
          />
          <h1 className="font-bold text-2xl sm:text-3xl mb-1">
            {session.user.username || "Usuário"}
          </h1>
          <p className="text-sm sm:text-lg text-gray-200">{session.user.email}</p>
        </CardHeader>

        <Divider className="my-6 bg-white" />

        <CardBody className="text-center space-y-4 text-sm sm:text-lg">
          <p>
            <strong>Cargo:</strong> {session.user.cargo || "Cargo não informado"}
          </p>
          <p>
            <strong>Carga Horária:</strong> {session.user.cargaHoraria || "Não especificada"}
          </p>
          <p>
            <strong>Papel:</strong> {session.user.roles?.[0] || "Não especificado"}
          </p>
          <p>
            <strong>Token:</strong> {session.user.token ? "Ativo" : "Inativo"}
          </p>
        </CardBody>
      </Card>

      {/* Modal para upload de imagem */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Escolher nova imagem de perfil</ModalHeader>
              <ModalBody>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={inputFileRef}
                  style={{ display: "none" }}
                />
                <Button onPress={handleOpenFileInput}>Escolher Imagem</Button>
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="Preview" className="w-32 h-32 rounded-full mx-auto" />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleRemoveSelectedImage}>
                  Excluir Imagem
                </Button>
                <Button color="primary" onPress={handleConfirmUpload} disabled={isPending}>
                  {isPending ? "Carregando..." : "Confirmar Upload"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Profile;
