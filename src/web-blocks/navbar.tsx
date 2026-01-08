import {
  builderProp,
  ChaiBlockComponentProps,
  ChaiStyles,
  registerChaiBlockSchema,
  StylesProp,
} from "@chaibuilder/runtime";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { map } from "lodash-es";
import { useState } from "react";

export type NavbarProps = {
  styles: ChaiStyles;
  shadow: string;
  layout: string;
  desktopLogo: string;
  mobileLogo: string;
  logoWidth: number;
  logoHeight: number;
  mobileLogoWidth: number;
  mobileLogoHeight: number;
  numberOfNavItems: number;
  // Individual nav items
  navItem1Label: string;
  navItem1Link: { type: string; href: string; target: string };
  navItem1Prefetch: boolean;
  navItem2Label: string;
  navItem2Link: { type: string; href: string; target: string };
  navItem2Prefetch: boolean;
  navItem3Label: string;
  navItem3Link: { type: string; href: string; target: string };
  navItem3Prefetch: boolean;
  navItem4Label: string;
  navItem4Link: { type: string; href: string; target: string };
  navItem4Prefetch: boolean;
  stickyNav: boolean;
  loginButtonUrl: string;
};

const NavbarBlock = (props: ChaiBlockComponentProps<NavbarProps>) => {
  const {
    blockProps,
    styles,
    shadow,
    layout,
    desktopLogo,
    mobileLogo,
    logoWidth,
    logoHeight,
    mobileLogoWidth,
    mobileLogoHeight,
    numberOfNavItems = 4,
    navItem1Label,
    navItem1Link,
    navItem2Label,
    navItem2Link,
    navItem3Label,
    navItem3Link,
    navItem4Label,
    navItem4Link,

    stickyNav,
    loginButtonUrl = "/login",
  } = props;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shadowClass = shadow !== "none" ? `shadow-${shadow}` : "";
  const stickyClass = stickyNav ? "sticky top-0 z-50" : "";

  // Build nav items array from individual props based on numberOfNavItems
  const allNavItems = [
    { label: navItem1Label, link: navItem1Link },
    { label: navItem2Label, link: navItem2Link },
    { label: navItem3Label, link: navItem3Link },
    { label: navItem4Label, link: navItem4Link },
  ];

  const navItems = allNavItems.slice(0, numberOfNavItems).filter((item) => item.label);

  // Layout classes for navigation items only
  const navItemsLayoutClass =
    layout === "left"
      ? "ml-8 mr-auto"
      : layout === "center"
        ? "mx-auto"
        : layout === "right"
          ? "ml-auto mr-8"
          : layout === "space-evenly"
            ? "flex-1 justify-evenly"
            : "ml-auto"; // default to right

  return (
    <nav
      {...blockProps}
      {...styles}
      id={blockProps.id || "navigation-bar"}
      className={`${styles?.className || ""} ${shadowClass} ${stickyClass}`}>
      <div className="container mx-auto flex items-center px-4 py-3">
        {/* Desktop Logo */}
        {desktopLogo && (
          <div className="hidden md:block">
            <img src={desktopLogo} alt="Logo" width={logoWidth} height={logoHeight} className="object-contain" />
          </div>
        )}

        {/* Mobile Logo */}
        {mobileLogo && (
          <div className="block md:hidden">
            <img
              src={mobileLogo}
              alt="Mobile Logo"
              width={mobileLogoWidth}
              height={mobileLogoHeight}
              className="object-contain"
            />
          </div>
        )}

        {/* Desktop Navigation Items */}
        <ul className={`hidden items-center space-x-6 md:flex ${navItemsLayoutClass}`}>
          {map(navItems, (item, index) => (
            <li key={index}>
              <a
                href={item.link?.href || "#"}
                target={item.link?.target || "_self"}
                className="transition-opacity hover:opacity-80">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login Button - Desktop */}
        <a
          id={`${blockProps.id || "navigation-bar"}-login-button`}
          href={loginButtonUrl}
          className="ml-4 hidden rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90 md:inline-block">
          Login
        </a>

        {/* Mobile Menu Button */}
        <button
          className="ml-auto block p-2 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu">
          <HamburgerMenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <ul className="container mx-auto space-y-3 px-4 py-4">
            {map(navItems, (item, index) => (
              <li key={index}>
                <a
                  href={item.link?.href || "#"}
                  target={item.link?.target || "_self"}
                  className="block transition-opacity hover:opacity-80"
                  onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            {/* Login Button - Mobile */}
            <li>
              <a
                id={`${blockProps.id || "navigation-bar"}-login-button-mobile`}
                href={loginButtonUrl}
                className="block rounded-md bg-primary px-4 py-2 text-center text-primary-foreground transition-opacity hover:opacity-90"
                onClick={() => setMobileMenuOpen(false)}>
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

const Config = {
  type: "Navbar",
  label: "Navbar",
  description:
    "A customizable navigation bar with logo and menu items. Features: Shadow effects, Sticky positioning, Separate desktop/mobile logos, Dynamic navigation items, Responsive hamburger menu.",
  category: "core",
  icon: HamburgerMenuIcon,
  group: "navigation",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("w-full bg-background text-foreground shadow-md"),
      stickyNav: {
        type: "boolean",
        title: "Sticky Navigation",
        description: "Keep navbar fixed at top",
        default: true,
      },
      shadow: builderProp({
        type: "string",
        title: "Shadow",
        description: "Add shadow depth to the navbar",
        default: "md",
        enum: ["none", "sm", "md", "lg", "xl", "2xl"],
      }),
      desktopLogo: {
        type: "string",
        title: "Desktop Logo",
        description: "Logo image for desktop view (hidden on mobile)",
        default: "",
        ui: { "ui:widget": "image" },
      },
      logoWidth: {
        type: "number",
        title: "Desktop Logo Width",
        description: "Width of the desktop logo in pixels",
        default: 120,
      },
      logoHeight: {
        type: "number",
        title: "Desktop Logo Height",
        description: "Height of the desktop logo in pixels",
        default: 40,
      },
      mobileLogo: {
        type: "string",
        title: "Mobile Logo",
        description: "Logo image for mobile view (hidden on desktop)",
        default: "",
        ui: { "ui:widget": "image" },
      },
      mobileLogoWidth: {
        type: "number",
        title: "Mobile Logo Width",
        description: "Width of the mobile logo in pixels",
        default: 100,
      },
      mobileLogoHeight: {
        type: "number",
        title: "Mobile Logo Height",
        description: "Height of the mobile logo in pixels",
        default: 32,
      },
      loginButtonUrl: {
        type: "string",
        title: "Login Button URL",
        description: "URL for the login button",
        default: "/login",
      },
      layout: builderProp({
        type: "string",
        title: "Items Layout",
        description: "How to arrange navigation items (logo is always on left)",
        default: "right",
        enum: ["left", "center", "right", "space-evenly"],
      }),
      // Nav Item 1
      navItem1Label: {
        type: "string",
        title: "Item 1",
        default: "Home",
      },
      navItem1Link: {
        type: "object",
        properties: {
          type: { type: "string" },
          href: { type: "string" },
          target: { type: "string" },
        },
        default: {
          type: "url",
          href: "/",
          target: "_self",
        },
        ui: {
          "ui:field": "link",
        },
      } as any,
      // Nav Item 2
      navItem2Label: {
        type: "string",
        title: "Item 2",
        default: "About",
      },
      navItem2Link: {
        type: "object",
        properties: {
          type: { type: "string" },
          href: { type: "string" },
          target: { type: "string" },
        },
        default: {
          type: "url",
          href: "",
          target: "_self",
        },
        ui: {
          "ui:field": "link",
        },
      } as any,
      // Nav Item 3
      navItem3Label: {
        type: "string",
        title: "Item 3",
        default: "",
      },
      navItem3Link: {
        type: "object",
        properties: {
          type: { type: "string" },
          href: { type: "string" },
          target: { type: "string" },
        },
        default: {
          type: "url",
          href: "",
          target: "_self",
        },
        ui: {
          "ui:field": "link",
        },
      } as any,
      // Nav Item 4
      navItem4Label: {
        type: "string",
        title: "Item 4",
        default: "",
      },
      navItem4Link: {
        type: "object",
        properties: {
          type: { type: "string" },
          href: { type: "string" },
          target: { type: "string" },
        },
        default: {
          type: "url",
          href: "",
          target: "_self",
        },
        ui: {
          "ui:field": "link",
        },
      } as any,
    },
  }),
  aiProps: ["navItem1Label", "navItem2Label", "navItem3Label", "navItem4Label"],
  i18nProps: ["navItem1Label", "navItem2Label", "navItem3Label", "navItem4Label"],
};

export { NavbarBlock as Component, Config };
