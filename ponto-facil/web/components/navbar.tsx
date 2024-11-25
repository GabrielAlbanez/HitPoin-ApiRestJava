"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { UserIcon } from "@/components/icons";
import image from "@/images/logo-removebg-preview.png";
import Image from "next/image";
import { UserAvatar } from "./UserAvatar";
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const stompClientRef = useRef(null);

  // Tipando o usuário
  type User = {
    username: string;
    email: string;
    token: string;
    roles: string[];
    cargaHoraria: string;
    cargo: string;
    imagePath?: string;
  };

  const typedUser = session?.user as User; // Cast para tipar corretamente

  useEffect(() => {
    const setupWebSocket = () => {
      const socket = new SockJS("https://hitpoint-backend-latest.onrender.com/ws");
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("WebSocket Debug:", str),
        onConnect: () => {
          console.log("Conectado ao WebSocket!");
        },
        onStompError: (frame) => {
          console.error("Erro no WebSocket:", frame.headers["message"]);
        },
      });

      stompClient.activate();
      stompClientRef.current = stompClient;

      return () => {
        stompClient.deactivate();
        console.log("WebSocket desconectado.");
      };
    };

    setupWebSocket();

    const handleTabClose = () => {
      if (stompClientRef.current?.connected) {
        const username = typedUser?.username || "Desconhecido";
        stompClientRef.current.publish({
          destination: "/app/status",
          body: JSON.stringify({ username, status: "inactive" }),
        });
        console.log(`Status "inactive" enviado para o usuário: ${username}`);
      }
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [typedUser]);

  const handleLogout = async () => {
    const username = typedUser?.username || "Desconhecido";

    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/app/status",
        body: JSON.stringify({ username, status: "inactive" }),
      });
      console.log(`Status de inatividade enviado para o usuário: ${username}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (status === "loading") {
    return null;
  }

  return (
    <NextUINavbar maxWidth="2xl" position="sticky">
      {/* Navbar Start Content */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image src={image} alt="logo" width={60} height={60} />
            <p className="font-bold text-inherit">PontoFacil</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {typedUser?.roles[0] === "BASIC" &&
            siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href} isActive={pathname === item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({
                      color: pathname === item.href ? "primary" : "foreground",
                    }),
                    "data-[active=true]:text-primary data-[active=true]:font-large"
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          {typedUser?.roles[0] === "ADMIN" && (
            <>
              <NavbarItem>
                <NextLink
                  className={clsx(
                    linkStyles({
                      color: pathname === "/admin" ? "primary" : "foreground",
                    }),
                    "data-[active=true]:text-primary data-[active=true]:font-large"
                  )}
                  href="/admin"
                >
                  Admin
                </NextLink>
              </NavbarItem>
              <NavbarItem>
                <NextLink
                  className={clsx(
                    linkStyles({
                      color:
                        pathname === "/register" ? "primary" : "foreground",
                    }),
                    "data-[active=true]:text-primary data-[active=true]:font-large"
                  )}
                  href="/register"
                >
                  Registrar Usuarios
                </NextLink>
              </NavbarItem>
            </>
          )}
          {typedUser?.roles[0] === "BASIC" && (
            <NavbarItem>
              <NextLink
                className={clsx(
                  linkStyles({
                    color: pathname === "/profile" ? "primary" : "foreground",
                  }),
                  "data-[active=true]:text-primary data-[active=true]:font-large"
                )}
                href="/profile"
              >
                Profile
              </NextLink>
            </NavbarItem>
          )}
        </ul>
      </NavbarContent>

      {/* Navbar End Content */}
      <NavbarContent
        className="hidden md:flex basis-1/5 md:basis-full"
        justify="end"
      >
        <ThemeSwitch />
        <NavbarItem className="hidden md:flex">
          {!typedUser ? (
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={"/login"}
              isDisabled={pathname === "/login"}
              startContent={<UserIcon className="text-danger" />}
              variant="flat"
            >
              Entrar
            </Button>
          ) : (
            <UserAvatar user={typedUser} onClick={handleLogout} />
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu Toggle */}
      <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Navbar Menu for Mobile */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {!typedUser ? (
            <NavbarMenuItem>
              <Link href="/login" color="primary" size="lg">
                Entrar
              </Link>
            </NavbarMenuItem>
          ) : (
            (typedUser.roles[0] == "ADMIN"
              ? siteConfig.navMenuItemsAdm
              : siteConfig.navMenuItems
            ).map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                {item.label === "Logout" ? (
                  <Button
                    color="danger"
                    onClick={handleLogout}
                    className="text-sm font-normal"
                    variant="flat"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    color={
                      item.href === pathname
                        ? "primary"
                        : item.href === "/logout"
                        ? "danger"
                        : "foreground"
                    }
                    href={item.href}
                    size="lg"
                  >
                    {item.label}
                  </Link>
                )}
              </NavbarMenuItem>
            ))
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
