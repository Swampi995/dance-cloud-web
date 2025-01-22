"use client";
import { JSX, useEffect, useState } from "react";
import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoUrl from "@/assets/images/logo.avif";

const Header = (): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex w-full justify-around p-1 transition-all duration-300 ${
        isScrolled
          ? "bg-background/20 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <NavLink
        to="/"
        className="flex items-center gap-2 self-center text-xl font-bold"
      >
        <Avatar>
          <AvatarImage src={logoUrl} />
          <AvatarFallback>DC</AvatarFallback>
        </Avatar>
        DanceCloud
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <NavLink to="/contact">Contact</NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              {/* TODO: Create a drop-down form */}
              <NavLink to="/login">Log In</NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export { Header };
