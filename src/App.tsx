import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "@/lib/auth-context";
import Progress from "@/assets/svg/progress.svg?react";

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Progress className="h-8 w-8 animate-spin" />
  </div>
);

const SidebarLayout = lazy(() => import("@/components/layout/SidebarLayout"));
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
const Sessions = lazy(() => import("./components/features/sessions/Sessions"));

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
            </Route>
            <Route element={<SidebarLayout />}>
              <Route path="/sessions" element={<Sessions />} />
            </Route>
            <Route path="/launch" element={<LaunchApp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
