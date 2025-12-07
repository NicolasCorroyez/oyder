import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import Header from "../ui/Header";
import Navigation from "../ui/Navigation";
import DashboardContent from "./DashboardContent";
import BasketsView from "../views/BasketsView";

const Dashboard = () => {
  const navigate = useNavigate();
  const { seller, signOut } = useAuth();
  const { orders, loadOrders } = useOrders();
  const [viewMode, setViewMode] = useState("oyders"); // "oyders" ou "baskets"

  // Fonction pour naviguer vers la page de détail d'une commande
  const openOrderModal = useCallback(
    (order) => {
      navigate(`/orders/${order.id}`);
    },
    [navigate]
  );

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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header seller={seller} onLogout={handleLogout} />

      {/* Header de la page */}
      <div className="flex items-center justify-center h-24 mb-4">
        <div className="bg-highlightblue h-24 rounded-[21px] w-11/12 text-white flex items-center p-5 justify-between shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <div className="flex-col">
            <p className="">Aujourd'hui</p>
            <p className="">
              {new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-3xl">
            <p className="">
              {(() => {
                const todayOrders = orders.filter(
                  (order) =>
                    order.pickupDate === new Date().toISOString().split("T")[0]
                );
                const count = todayOrders.length;
                return `${count} ${count === 1 ? "Oyder" : "Oyders"}`;
              })()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 ml-5 mb-6">
        <button
          onClick={() => setViewMode("baskets")}
          className={`h-2 rounded-xl w-28 flex items-center justify-center p-5 border-[0.5px] border-black ${
            viewMode === "baskets" ? "bg-highlightblue text-white" : "bg-white"
          }`}
        >
          <div className="flex-col">
            <p className="">Paniers</p>
          </div>
        </button>
        <button
          onClick={() => setViewMode("oyders")}
          className={`h-2 rounded-xl w-28 flex items-center justify-center p-5 ${
            viewMode === "oyders"
              ? "bg-highlightblue text-white"
              : "bg-white border-[0.5px] border-black"
          }`}
        >
          <div className="flex-col">
            <p className="">Oyders</p>
          </div>
        </button>
      </div>

      {/* Navigation et contenu principal */}
      <div className="flex">
        <Navigation />

        {/* Contenu principal - responsive */}
        <main className="flex-1 p-2 w-full pb-20 ">
          {viewMode === "baskets" ? (
            <BasketsView orders={orders} onOrderClick={openOrderModal} />
          ) : (
            <DashboardContent
              orders={orders}
              onOrderClick={openOrderModal}
              onEditOrder={handleEditOrder}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
