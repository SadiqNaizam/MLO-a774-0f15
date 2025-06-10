import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Renamed to avoid conflict if another 'Sonner' is used
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import OrdersManagementPage from "./pages/OrdersManagementPage";
import ProductsManagementPage from "./pages/ProductsManagementPage";
import CustomersManagementPage from "./pages/CustomersManagementPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound"; // Assuming this exists

const queryClient = new QueryClient();

const App = () => {
  console.log("App loaded, router initialized.");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster /> {/* Use the renamed import */}
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/dashboard/orders" element={<OrdersManagementPage />} />
            <Route path="/dashboard/products" element={<ProductsManagementPage />} />
            <Route path="/dashboard/customers" element={<CustomersManagementPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            
            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;