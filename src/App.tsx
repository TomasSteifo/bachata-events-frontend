import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Festivals from "./pages/Festivals";
import FestivalDetails from "./pages/FestivalDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/organizer/Dashboard";
import CreateFestival from "./pages/organizer/CreateFestival";
import EditFestival from "./pages/organizer/EditFestival";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/festivals" element={<Festivals />} />
              <Route path="/festivals/:id" element={<FestivalDetails />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute requireOrganizer>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/festivals/new"
                element={
                  <ProtectedRoute requireOrganizer>
                    <CreateFestival />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/festivals/:id/edit"
                element={
                  <ProtectedRoute requireOrganizer>
                    <EditFestival />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
