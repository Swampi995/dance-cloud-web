import { RootLayout } from "@/components/layout/RootLayout";
import { LaunchApp } from "@/components/features/launch/LaunchAppHero";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingHero } from "./components/features/landing/LandingHero";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingHero />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/launch" element={<LaunchApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
