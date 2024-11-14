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

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  if (status === "loading") {
    return null;
  }

  return (
    <NextUINavbar maxWidth="2xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image src={image} alt="logo" width={60} height={60} />
            <p className="font-bold text-inherit">PontoFacil</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {session?.user.roles[0] === "BASIC" &&
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
          {session?.user.roles[0] === "ADMIN" && (
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
          {session?.user.roles[0] === "BASIC" && (
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

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <ThemeSwitch />
        <NavbarItem className="hidden md:flex">
          {!session?.user ? (
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
            <>
              <UserAvatar user={session.user} onClick={handleLogout} />
              {/* <Button
                className="text-sm font-normal text-default-600 bg-default-100"
                color="danger"
                startContent={<UserIcon className="text-danger" />}
                variant="flat"
                onClick={handleLogout}
              >
                Logout
              </Button> */}
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {!session ? (
            <NavbarMenuItem>
              <Link href="/login" color="primary" size="lg">
                Entrar
              </Link>
            </NavbarMenuItem>
          ) : (
            (session?.user?.roles[0] == "ADMIN"
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
