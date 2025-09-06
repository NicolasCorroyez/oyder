import React, { useState } from "react";
import OrderCard from "../ui/OrderCard";
import BasketOrdersModal from "../ui/BasketOrdersModal";
import WeatherInfo from "../ui/WeatherInfo";
import { useOrders } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import {
  calculateBasketsSummary,
  oysterTypeLabels,
} from "../../utils/constants";

const DashboardContent = ({ orders = [], onOrderClick }) => {
  const { updateOrder } = useOrders();
  const { seller } = useAuth();
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

  // Calculer les commandes du jour
  const todayOrders = React.useMemo(() => {
    const today = new Date();
    // Utiliser la date locale au lieu d'UTC pour éviter les décalages de fuseau horaire
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    return orders.filter((order) => {
      // Les dates de pickupDate sont déjà stockées au format YYYY-MM-DD
      return order.pickupDate === todayString;
    });
  }, [orders]);

  // Calculer le résumé des paniers pour les commandes actives du jour
  const basketsSummary = React.useMemo(() => {
    return calculateBasketsSummary(todayOrders);
  }, [todayOrders]);

  // Gestionnaire pour cliquer sur une carte de paniers
  const handleBasketClick = (oysterType) => {
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

      <h1 className="text-l font-bold text-white flex text-2xl justify-start mb-3">
        Bonjour {seller?.displayName || seller?.email || "Utilisateur"}
      </h1>
      <div className="flex justify-start">
        <WeatherInfo />
      </div>

      {/* Résumé des paniers à préparer */}
      {basketsSummary.length > 0 && (
        <div className="bg-gray-100 rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Paniers du jour
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {basketsSummary.map((item) => (
              <button
                key={item.type}
                onClick={() => handleBasketClick(item.type)}
                className="bg-white border shadow-lg border-white-200 rounded-lg p-3 cursor-pointer hover:bg-amber-100 hover:border-amber-300 transition-colors w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">
                      {oysterTypeLabels[item.type] || item.type}
                    </p>
                    <p className="text-xs text-black">
                      {item.orders} commande{item.orders > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">
                      {item.baskets}
                    </p>
                    <p className="text-xs text-black">
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
      <div className="bg-gray-100 rounded-lg shadow-sm p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            Commandes du jour
          </h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-300 px-3 py-1 rounded-full">
            {todayOrders.length} commande{todayOrders.length > 1 ? "s" : ""}
          </span>
        </div>
        {todayOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-6 lg:py-8">
            Aucune commande prévue pour aujourd'hui
          </p>
        ) : (
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
        )}
      </div>

      {/* Modale des commandes par type d'huîtres */}
      <BasketOrdersModal
        isOpen={isBasketModalOpen}
        onClose={closeBasketModal}
        orders={selectedBasketType?.orders || []}
        oysterType={selectedBasketType?.type}
        selectedDate={(() => {
          const today = new Date();
          return (
            today.getFullYear() +
            "-" +
            String(today.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(today.getDate()).padStart(2, "0")
          );
        })()}
        onOrderClick={onOrderClick}
      />
    </div>
  );
};

export default DashboardContent;
