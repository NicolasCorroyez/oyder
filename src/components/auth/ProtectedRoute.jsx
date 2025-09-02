import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Rediriger vers le login si pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
