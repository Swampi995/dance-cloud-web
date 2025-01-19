import { RootLayout } from "@/components/layout/RootLayout";
import { LaunchApp } from "@/components/features/launch/LaunchAppHero";
import { BrowserRouter, Route, Routes } from "react-router";
import { LandingHero } from "./components/features/landing/LandingHero";
import { Header } from "./components/common/Header";
import { NotFound } from "./components/features/not_found/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RootLayout>
              <Header />
              <LandingHero />
            </RootLayout>
          }
        />
        <Route
          path="/launch"
          element={
            <RootLayout>
              <LaunchApp />
            </RootLayout>
          }
        />
        <Route
          path="*"
          element={
            <RootLayout>
              <Header />
              <NotFound />
            </RootLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
