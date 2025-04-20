
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Models from "./pages/Models";
import ModelDetail from "./components/Models/ModelDetail";
import Logs from "./pages/Logs";
import FeatureFlags from "./pages/FeatureFlags";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Forecast from "./pages/Forecast";
import AIModelComparison from "./pages/AIModelComparison";
import StrategyLibrary from "./pages/StrategyLibrary";
import ModelAccuracy from "./pages/ModelAccuracy";
import ModelBenchmark from "./pages/ModelBenchmark";
import Chatbot from "./pages/Chatbot";
import Team from "./pages/Team";
import Portfolio from "./pages/Portfolio";
import Onboarding from "./pages/Onboarding";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/models" element={<Models />} />
                <Route path="/models/:modelId" element={<ModelDetail />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/feature-flags" element={<FeatureFlags />} />
                <Route path="/ai-model-comparison" element={<AIModelComparison />} />
                <Route path="/strategy-library" element={<StrategyLibrary />} />
                <Route path="/model-accuracy" element={<ModelAccuracy />} />
                <Route path="/model-benchmark" element={<ModelBenchmark />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/team" element={<Team />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
