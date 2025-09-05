import React, { useState } from "react";
import OrderCard from "../ui/OrderCard";
import BasketOrdersModal from "../ui/BasketOrdersModal";
import { useOrders } from "../../hooks/useOrders";
import {
  calculateBasketsSummary,
  oysterTypeLabels,
} from "../../utils/constants";

const DashboardContent = ({ orders = [], onOrderClick }) => {
  const { updateOrder } = useOrders();
  const [selectedBasketType, setSelectedBasketType] = useState(null);
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);

  const handleStatusChange = async (order, newStatus) => {
    try {
      await updateOrder(order.id, {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };
  // Calculer les statistiques du jour uniquement
  const stats = React.useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    // Filtrer les commandes du jour
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.pickupDate);
      const orderDateString = orderDate.toISOString().split("T")[0];
      return orderDateString === todayString;
    });

    const stats = {
      total: todayOrders.length,
      active: todayOrders.filter((o) => o.status === "active").length,
      cancelled: todayOrders.filter((o) => o.status === "annulee").length,
      completed: todayOrders.filter((o) => o.status === "recue").length,
      byLocation: {},
      byType: {},
    };

    todayOrders.forEach((order) => {
      // Par lieu
      if (!stats.byLocation[order.location]) {
        stats.byLocation[order.location] = 0;
      }
      stats.byLocation[order.location]++;

      // Par type d'huîtres
      if (!stats.byType[order.oysterType]) {
        stats.byType[order.oysterType] = 0;
      }
      stats.byType[order.oysterType]++;
    });

    return stats;
  }, [orders]);

  // Calculer le résumé des paniers pour les commandes actives du jour
  const basketsSummary = React.useMemo(() => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.pickupDate);
      const orderDateString = orderDate.toISOString().split("T")[0];
      return orderDateString === todayString;
    });

    return calculateBasketsSummary(todayOrders);
  }, [orders]);

  // Gestionnaire pour cliquer sur une carte de paniers
  const handleBasketClick = (oysterType) => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    const todayOrders = orders.filter((order) => {
      const orderDate = new Date(order.pickupDate);
      const orderDateString = orderDate.toISOString().split("T")[0];
      return orderDateString === todayString;
    });

    // Filtrer les commandes du type sélectionné
    const filteredOrders = todayOrders.filter(
      (order) =>
        order.oysterType === oysterType &&
        order.status === "active" &&
        order.quantity > 0
    );

    setSelectedBasketType({ type: oysterType, orders: filteredOrders });
    setIsBasketModalOpen(true);
  };

  // Fermer la modale des paniers
  const closeBasketModal = () => {
    setIsBasketModalOpen(false);
    setSelectedBasketType(null);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-2 lg:p-2">
        <h1 className="text-l font-bold text-gray-900 flex justify-center">
          Votre journée
        </h1>
        {/* <p className="text-sm lg:text-base text-gray-600">
          Bienvenue, {seller?.displayName} !
        </p> */}
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Total
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Active
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Annulée
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {stats.cancelled}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">
                Récupérée
              </p>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé des paniers à préparer */}
      {basketsSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-amber-500 mr-2">🛒</span>
            Paniers à préparer aujourd'hui
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {basketsSummary.map((item) => (
              <button
                key={item.type}
                onClick={() => handleBasketClick(item.type)}
                className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-pointer hover:bg-amber-100 hover:border-amber-300 transition-colors w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      {oysterTypeLabels[item.type] || item.type}
                    </p>
                    <p className="text-xs text-amber-600">
                      {item.orders} commande{item.orders > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-700">
                      {item.baskets}
                    </p>
                    <p className="text-xs text-amber-600">
                      panier{item.baskets > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dernières commandes */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
          Commandes du jour
        </h3>
        <label className="text-sm font-medium text-gray-700">
          Cliquer sur "Active" pour passer en "Livré"
        </label>

        {(() => {
          const today = new Date();
          const todayString = today.toISOString().split("T")[0];
          const todayOrders = orders.filter((order) => {
            const orderDate = new Date(order.pickupDate);
            const orderDateString = orderDate.toISOString().split("T")[0];
            return orderDateString === todayString;
          });

          if (todayOrders.length === 0) {
            return (
              <p className="text-gray-500 text-center py-6 lg:py-8">
                Aucune commande prévue pour aujourd'hui
              </p>
            );
          }

          return (
            <div className="space-y-3">
              {todayOrders.slice(0, 5).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOrderClick={onOrderClick}
                  onStatusChange={handleStatusChange}
                  showStatusToggle={true}
                />
              ))}
            </div>
          );
        })()}
      </div>

      {/* Modale des commandes par type d'huîtres */}
      <BasketOrdersModal
        isOpen={isBasketModalOpen}
        onClose={closeBasketModal}
        orders={selectedBasketType?.orders || []}
        oysterType={selectedBasketType?.type}
        selectedDate={new Date().toISOString().split("T")[0]}
        onOrderClick={onOrderClick}
      />
    </div>
  );
};

export default DashboardContent;
