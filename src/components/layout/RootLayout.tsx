import { JSX } from "react";
import { Outlet } from "react-router";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";

const RootLayout = (): JSX.Element => {
  return (
    <div className="bg-background">
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export { RootLayout };
