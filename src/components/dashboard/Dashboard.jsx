import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import Header from "../ui/Header";
import Navigation from "../ui/Navigation";
import DashboardContent from "./DashboardContent";
import CalendarView from "../views/CalendarView";
import OverviewView from "../views/OverviewView";
import StatsView from "../views/StatsView";
import OrderForm from "../views/OrderForm";
import OrderModal from "../ui/OrderModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { seller, signOut } = useAuth();
  const { orders, loadOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir la modale d'une commande
  const openOrderModal = useCallback((order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  // Fonction pour fermer la modale
  const closeOrderModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Fonction pour naviguer vers l'édition d'une commande
  const handleEditOrder = (orderId) => {
    console.log("handleEditOrder appelé avec orderId:", orderId);
    console.log("Navigation vers:", `/orders/${orderId}/edit`);
    navigate(`/orders/${orderId}/edit`);
  };

  useEffect(() => {
    // Charger toutes les commandes au démarrage
    let unsubscribe;

    const loadData = async () => {
      try {
        // Charger toutes les commandes sans filtres
        unsubscribe = await loadOrders();
      } catch (error) {
        console.error("Erreur chargement commandes:", error);
      }
    };

    loadData();

    // Nettoyer l'écouteur
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [loadOrders]);

  // Gérer la redirection pour les routes de commandes individuelles
  useEffect(() => {
    if (
      location.pathname.startsWith("/orders/") &&
      location.pathname !== "/orders/new" &&
      !location.pathname.includes("/edit")
    ) {
      const orderId = location.pathname.split("/")[2];
      const order = orders.find((o) => o.id === orderId);

      if (order) {
        // Ouvrir la modale et rediriger
        openOrderModal(order);
        navigate("/", { replace: true });
      } else {
        // Commande introuvable, rediriger
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, orders, navigate, openOrderModal]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  // Fonction pour afficher le bon contenu selon la route
  const renderContent = () => {
    // Route d'édition d'une commande
    if (
      location.pathname.includes("/orders/") &&
      location.pathname.includes("/edit")
    ) {
      return <OrderForm />;
    }

    // Route de création d'une nouvelle commande
    if (location.pathname === "/orders/new") {
      return <OrderForm />;
    }

    // Routes de commandes individuelles - maintenant gérées par useEffect
    if (
      location.pathname.startsWith("/orders/") &&
      location.pathname !== "/orders/new" &&
      !location.pathname.includes("/edit")
    ) {
      // Retourner le contenu du dashboard pendant la redirection
      return (
        <DashboardContent
          orders={orders}
          onOrderClick={openOrderModal}
          onEditOrder={handleEditOrder}
        />
      );
    }

    // Routes principales du dashboard
    switch (location.pathname) {
      case "/":
        return (
          <DashboardContent
            orders={orders}
            onOrderClick={openOrderModal}
            onEditOrder={handleEditOrder}
          />
        );
      case "/calendar":
        return (
          <CalendarView
            orders={orders}
            onOrderClick={openOrderModal}
            onEditOrder={handleEditOrder}
          />
        );
      case "/overview":
        return (
          <OverviewView
            orders={orders}
            onOrderClick={openOrderModal}
            onEditOrder={handleEditOrder}
          />
        );
      case "/stats":
        return <StatsView orders={orders} />;
      default:
        return (
          <DashboardContent
            orders={orders}
            onOrderClick={openOrderModal}
            onEditOrder={handleEditOrder}
          />
        );
    }
  };

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header seller={seller} onLogout={handleLogout} />

      <div className="flex">
        <Navigation />

        {/* Contenu principal - responsive */}
        <main className="flex-1 p-4 lg:p-6 w-full lg:ml-0 pb-20 lg:pb-6">
          {renderContent()}
        </main>
      </div>

      {/* Modale de détail de commande */}
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeOrderModal}
        onEditOrder={handleEditOrder}
      />
    </div>
  );
};

export default Dashboard;
