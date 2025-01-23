import { Separator } from "@/components/ui/separator";
import { JSX } from "react";
import { NavLink } from "react-router";

const Footer = (): JSX.Element => {
  return (
    <footer className="w-full bg-background">
      <div className="px-4 pb-8">
        <Separator className="mb-4" />

        {/* Copyright */}
        <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DanceCloud. All rights reserved.
          </p>
          <div className="flex space-x-9">
            <NavLink
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Use
            </NavLink>
            <NavLink
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
