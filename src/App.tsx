
import AppProviders from "@/providers/AppProviders";
import MainLayout from "@/layouts/MainLayout";
import AppRoutes from "@/routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider } from "./contexts/DataContext";

const queryClient = new QueryClient();

const App = () => {
  // Set document title for better SEO
  document.title = "Master Tools BD - Premium Learning Platform Access";
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <DataProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </DataProvider>
      </AppProviders>
    </QueryClientProvider>
  );
};

export default App;
