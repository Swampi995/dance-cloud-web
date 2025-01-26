import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "@/lib/auth-context";
import Progress from "@/assets/svg/progress.svg?react";

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Progress className="h-8 w-8 animate-spin" />
  </div>
);

const RootLayout = lazy(() => import("@/components/layout/RootLayout"));
const LaunchApp = lazy(
  () => import("@/components/features/launch/LaunchAppHero"),
);
const LandingHero = lazy(
  () => import("./components/features/landing/LandingHero"),
);
const PrivacyPolicy = lazy(() => import("./components/features/privacy"));
const Login = lazy(() => import("./components/features/login/Login"));
const TermsOfService = lazy(() => import("./components/features/terms"));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
