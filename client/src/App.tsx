import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import RecipesPage from "@/pages/recipes-page";
import PantryPage from "@/pages/pantry-page";
import CommunityPage from "@/pages/community-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Navbar } from "@/components/navbar";

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/recipes" component={RecipesPage} />
        <ProtectedRoute path="/pantry" component={PantryPage} />
        <ProtectedRoute path="/community" component={CommunityPage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {

  console.log('All env variables:', import.meta.env);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);



  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;