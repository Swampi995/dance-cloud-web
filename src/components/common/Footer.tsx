import { Separator } from "@/components/ui/separator";
import { memo } from "react";
import { NavLink } from "react-router";

const currentYear = new Date().getFullYear();
const navLinks = [
  { to: "/terms", label: "Terms of Use" },
  { to: "/privacy", label: "Privacy Policy" },
];

const Footer = memo(() => (
  <footer className="w-full bg-background">
    <div className="px-4 pb-8">
      <Separator className="mb-4" />

      {/* Copyright */}
      <div className="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <p className="text-sm text-muted-foreground">
          © {currentYear} DanceCloud. All rights reserved.
        </p>
        <div className="flex space-x-9">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";

export { Footer };
