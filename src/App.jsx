import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginScreen from "./components/auth/LoginScreen";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import OrderForm from "./components/views/OrderForm";
import OrderDetailPage from "./components/views/OrderDetailPage";
import DayOrdersPage from "./components/views/DayOrdersPage";
import BasketOrdersPage from "./components/views/BasketOrdersPage";
import CalendarPage from "./components/views/CalendarPage";
import OverviewPage from "./components/views/OverviewPage";
import StatsPage from "./components/views/StatsPage";
import BasketsPage from "./components/views/BasketsPage";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">⏳</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route publique */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen />
            }
          />

          {/* Routes protégées - toutes les vues du dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/baskets"
            element={
              <ProtectedRoute>
                <BasketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <ProtectedRoute>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/day/:date"
            element={
              <ProtectedRoute>
                <DayOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/baskets/:date/:oysterType"
            element={
              <ProtectedRoute>
                <BasketOrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
