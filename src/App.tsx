import { RootLayout } from "@/components/layout/RootLayout";
import { LaunchApp } from "@/components/features/launch/LaunchAppHero";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LandingHero } from "./components/features/landing/LandingHero";
import { PrivacyPolicy } from "./components/features/privacy";
import { Login } from "./components/features/login/Login";
import { TermsOfService } from "./components/features/terms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingHero />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/launch" element={<LaunchApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
