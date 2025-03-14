import { JSX, Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { ClubProvider } from "./providers/ClubProvider";
import { useAuth } from "./hooks/use-auth";
import { Loading } from "./components/common/Loading";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

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
const Classes = lazy(() => import("./components/features/classes/Classes"));

function App() {
  return (
    <AuthProvider>
      <ClubProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<LandingHero />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
              </Route>
              <Route
                element={
                  <PrivateRoute>
                    <SidebarLayout />
                  </PrivateRoute>
                }
              >
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/monthly_summary" element={<Classes />} />
              </Route>
              <Route path="/launch" element={<LaunchApp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ClubProvider>
    </AuthProvider>
  );
}

export default App;
