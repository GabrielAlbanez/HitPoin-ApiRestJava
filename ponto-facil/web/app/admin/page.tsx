"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import image from "@/images/logo-removebg-preview.png";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import axios from "axios";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const columns = [
  { name: "ID", uid: "userId" },
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "Carga Horária", uid: "cargaHoraria" },
  { name: "ACTIONS", uid: "actions" },
];

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backdrop, setBackdrop] = useState("opaque"); // Opaque backdrop by default

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user) {
        setLoading(false);
        setError("Você não está logado.");
        return;
      }

      const token = session.user.token;
      try {
        const response = await axios.get(
          "http://localhost:8081/usuarios/allUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading" && session?.user) {
      fetchUsers();
    } else if (status !== "loading" && session?.user!.roles[0] !== "ADMIN") {
      router.push("/login");
    }
  }, [session, status, router,users]);

  const handleOpenModal = (user, backdropType = "opaque") => {
    setSelectedUser(user);
    console.log(user);
    setBackdrop(backdropType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: user?.imagePath
                ? `http://localhost:8081/api/${user.imagePath}`
                : "https://th.bing.com/th/id/OIP.dC6CwT2I2vj7goUpkPFvVgHaEK?rs=1&pid=ImgDetMain",
            }}
            description={user.email}
            name={user.userName}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-900">
              {user.cargo ?? "undefined"}
            </p>
          </div>
        );

      case "cargaHoraria":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{}</p>
            <p className="text-bold text-sm capitalize text-default-900">
              {user.cargaHoraria ?? "undefined"}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Pontos">
              <span
                className="text-lg text-default-700 cursor-pointer active:opacity-50"
                onClick={() => handleOpenModal(user, "blur")}
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar Usuário">
              <span className="text-lg text-success-300 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Excluir Usuário">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto w-full">
      <Table
        aria-label="Tabela de usuários com avatares"
        css={{ minWidth: "600px" }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              width={column.width || "auto"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.userId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal com NextUI para Exibir Pontos do Usuário */}
      <Modal
        backdrop={"opaque"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Pontos de {selectedUser?.userName}
              </ModalHeader>
              <ModalBody className="max-h-96 overflow-y-auto">
                {selectedUser?.pontos && selectedUser.pontos.length > 0 ? (
                  selectedUser.pontos.map((ponto) => (
                    <p key={ponto.pointId} className="text-default-700">
                      {ponto.tipoPonto} - {ponto.hora} (Dia: {ponto.dia}/
                      {ponto.mes})
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum ponto registrado.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                >
                  Fechar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminPage;
