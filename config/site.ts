export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "OP_RETURN Example",
  description:
    "An example of OP_RETURN in action using the BSV SDK.",
  businessName: "Build Software",
  domain: "https://www.buildsoftware.co.za",
  domainShort: "buildsoftware.co.za",
  supportEmail: "shane@buildsoftware.co.za",
  defaultUserPassword: "Changeme2024!",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    dashboard: "/",
    assets: "/home",
    settings: "/settings"
  },
}
