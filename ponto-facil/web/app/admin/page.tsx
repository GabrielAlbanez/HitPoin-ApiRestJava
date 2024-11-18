"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
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
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  PlusIcon,
  SearchIcon,
  ChevronDownIcon,
  EyeIcon,
  EditIcon,
  DeleteIcon,
} from "@/components/icons";
import Register from "@/components/Register"; // Importando o componente de registro
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
  { name: "STATUS", uid: "status" },
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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State para o modal do componente de registro
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

        const usersWithValues = response.data.map((user) => ({
          ...user,
          role: user.cargo || "undefined",
          status: user.status || "active",
          cargaHoraria: user.cargaHoraria || "undefined",
        }));

        setUsers(usersWithValues);
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
  }, [session, status, router]);

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    if (statusFilter !== "all" && user.status !== statusFilter) return false;
    if (filterValue && !user.userName.toLowerCase().includes(filterValue.toLowerCase())) return false;
    return true;
  });

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
                : "https://via.placeholder.com/150",
            }}
            name={user.userName}
            description={user.email}
          />
        );
      case "role":
        return <p className="capitalize">{user.role}</p>;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {user.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Pontos">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => handleOpenModal(user)}
              >
                <EyeIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Editar">
              <Button isIconOnly size="sm" variant="flat">
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Excluir">
              <Button isIconOnly size="sm" variant="light" color="danger">
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const topContent = (
    <div className="flex rounded-xl flex-wrap justify-between items-center gap-4 px-4 py-4 border-default-200 border-[1px] mb-4">
      <Input
        placeholder="Search by name..."
        startContent={<SearchIcon />}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="w-full md:w-1/3"
      />
      <Dropdown>
        <DropdownTrigger>
          <Button endContent={<ChevronDownIcon />}>Filter by Status</Button>
        </DropdownTrigger>
        <DropdownMenu onSelectionChange={(key) => setStatusFilter(key)}>
          <DropdownItem key="all">All</DropdownItem>
          <DropdownItem key="active">Active</DropdownItem>
          <DropdownItem key="paused">Paused</DropdownItem>
          <DropdownItem key="vacation">Vacation</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {session?.user?.roles?.[0] === "ADMIN" && (
        <Button
          size="sm"
          color="primary"
          endContent={<PlusIcon />}
          onPress={handleOpenRegisterModal} // Abre o modal do componente de registro
        >
          Add New
        </Button>
      )}
    </div>
  );

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto w-full">
      {topContent}
      <Table
        aria-label="Tabela de usuários"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={filteredUsers}>
          {(item) => (
            <TableRow key={item.userId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal para o Componente de Registro */}
      <Modal className="overflow-y-auto max-h-[90%]" isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal}>
        <ModalContent>
          <ModalBody>
            <Register />
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleCloseRegisterModal} color="danger">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminPage;
