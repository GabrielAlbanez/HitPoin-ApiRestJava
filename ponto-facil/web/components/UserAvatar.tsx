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
    imagePath : string;
  };
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, onClick }) => {
  console.log(user);

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
              src={user?.imagePath ? `http://localhost:8081/api/${user.imagePath}` : "https://th.bing.com/th/id/OIP.dC6CwT2I2vj7goUpkPFvVgHaEK?rs=1&pid=ImgDetMain"}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile">
              <p>{user.email}</p>
            </DropdownItem>
            <DropdownItem key="profile">
              <Link href={"/profile"}>
                <p>profile</p>
              </Link>
            </DropdownItem>
            <DropdownItem onClick={onClick} key="logout-action" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
    
  );
};