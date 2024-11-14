export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Ponto Facil",
  description: "Otimize o gerenciamento do seu trabalho.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },

    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/login",
    },
    
  ],

  navMenuItemsAdm: [
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Register",
      href: "/register",
    },

    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/login",
    },
  ],

  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
