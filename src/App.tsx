
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Models from "./pages/Models";
import ModelDetail from "./components/Models/ModelDetail";
import Logs from "./pages/Logs";
import FeatureFlags from "./pages/FeatureFlags";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Forecast from "./pages/Forecast";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/models" element={<Models />} />
            <Route path="/models/:modelId" element={<ModelDetail />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/feature-flags" element={<FeatureFlags />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
