import { RootLayout } from "@/components/layout/RootLayout";
import { LaunchApp } from "@/components/features/launch/LaunchAppHero";
import { BrowserRouter, Route, Routes } from "react-router";
import { LandingHero } from "./components/features/landing/LandingHero";
import { NotFound } from "./components/features/not_found/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingHero />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/launch" element={<LaunchApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
