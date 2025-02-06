"use client";
import { useEffect, useState, useCallback, JSX } from "react";
import { NavLink } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/images/logo.avif";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

const Header = (): JSX.Element => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
        console.error(error.code);
      } else {
        console.error(error);
      }
    }
  }, [toast]);

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
              {user ? (
                <button onClick={handleSignOut}>Log Out</button>
              ) : (
                <NavLink to="/login">Log In</NavLink>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

Header.displayName = "Header";

export { Header };
