import React, { useState } from "react";
import OrderCard from "./OrderCard";
import BasketOrdersModal from "./BasketOrdersModal";
import { useOrders } from "../../hooks/useOrders";
import {
  calculateBasketsSummary,
  oysterTypeLabels,
} from "../../utils/constants";

const DayOrdersModal = ({
  isOpen,
  onClose,
  dayOrders,
  selectedDate,
  onOrderClick,
}) => {
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

  if (!isOpen || !dayOrders) return null;

  // Calculer le résumé des paniers pour les commandes actives du jour
  const basketsSummary = calculateBasketsSummary(dayOrders);

  // Gestionnaire pour cliquer sur une carte de paniers
  const handleBasketClick = (oysterType) => {
    // Filtrer les commandes du type sélectionné
    const filteredOrders = dayOrders.filter(
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-highlightblue bg-opacity-50 flex items-end justify-center z-50"
      onClick={onClose}
    >
      {/* Modale depuis le bas */}
      <div
        className="bg-white w-full h-[80vh] shadow-2xl transform transition-transform duration-300 ease-in-out rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {formatDate(selectedDate)}
            </h2>
          </div>
        </div>

        {/* Contenu de la modale */}
        <div className="p-6 overflow-y-auto h-[calc(80vh-80px)]">
          {dayOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-500">
                Aucune commande prévue pour ce jour
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Résumé des paniers à préparer */}
              {basketsSummary.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-amber-500 mr-2">🛒</span>
                    Paniers à préparer
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

              {/* Liste des commandes actives */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                  Commandes actives
                </h3>
                <div className="space-y-3">
                  {dayOrders
                    .filter((order) => order.status === "active")
                    .map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onOrderClick={onOrderClick}
                        onStatusChange={handleStatusChange}
                        showStatusToggle={true}
                      />
                    ))}
                  {dayOrders.filter((order) => order.status === "active")
                    .length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune commande active pour ce jour
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modale des commandes par type d'huîtres */}
      <BasketOrdersModal
        isOpen={isBasketModalOpen}
        onClose={closeBasketModal}
        orders={selectedBasketType?.orders || []}
        oysterType={selectedBasketType?.type}
        selectedDate={selectedDate}
        onOrderClick={onOrderClick}
      />
    </div>
  );
};

export default DayOrdersModal;
