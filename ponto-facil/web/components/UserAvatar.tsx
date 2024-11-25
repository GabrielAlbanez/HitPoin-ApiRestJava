"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import Link from "next/link";

interface UserAvatarProps {
  onClick: () => void;
  user: {
    username: string;
    email: string;
    token: string;
    roles: string[];
    cargaHoraria: string;
    cargo: string;
    imagePath?: string;
  };
}

// Função para determinar a imagem padrão com base no username
const getDefaultAvatar = (username: string): string => {
  // Verifica se o nome parece feminino ou masculino
  const isFemale =
    ["a", "e", "i", "y"].includes(username[username.length - 1].toLowerCase());

  // Retorna a URL correspondente
  return isFemale
    ? "https://cdnb.artstation.com/p/assets/images/images/042/809/195/large/mace-tan-mace-kayle-fanart-finaledit.jpg?1635490851"
    : "https://pbs.twimg.com/media/Dtv9ICMWsAE-tz9.jpg";
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, onClick }) => {
  const avatarSrc = user.imagePath
    ? `https://hitpoint-backend-latest.onrender.com/api/${user.imagePath}`
    : getDefaultAvatar(user.username);


    // console.log("url",`https://hitpoint-backend-latest.onrender.com/api/${user.imagePath}`)

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name={user.username || "User"}
          size="sm"
          src={avatarSrc}
        />
      </DropdownTrigger>

      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile">
          <p>{user.email}</p>
        </DropdownItem>
        <DropdownItem key="profile">
          <Link href={"/profile"}>
            <p>Profile</p>
          </Link>
        </DropdownItem>
        <DropdownItem onClick={onClick} key="logout-action" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
