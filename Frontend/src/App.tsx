import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";

import LandingPage from "./pages/LandingPage";
import { AuthProvider } from "./components/auth/AuthProvider";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import MyItemsPage from "./pages/MyItemsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen h-full bg-base-200 w-screen">
            <Navbar />
            <main className="w-screen">
              <Routes>
                <Route index element={<LandingPage />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-items"
                  element={
                    <ProtectedRoute>
                      <MyItemsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
