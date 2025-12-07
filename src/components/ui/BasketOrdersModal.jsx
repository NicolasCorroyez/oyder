import React from "react";
import { X } from "lucide-react";
import OrderCard from "./OrderCard";
import { useOrders } from "../../hooks/useOrders";
import { oysterTypeLabels, calculateBaskets } from "../../utils/constants";

const BasketOrdersModal = ({
  isOpen,
  onClose,
  orders,
  oysterType,
  selectedDate = null,
  onOrderClick,
}) => {
  const { updateOrder } = useOrders();

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

  if (!isOpen || !oysterType) return null;

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
      className="fixed inset-0 bg-highlightblue bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Commandes {oysterTypeLabels[oysterType] || oysterType}
              </h2>
              {selectedDate && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedDate)}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu de la modale */}
        <div className="p-6">
          {!orders || orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🦪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande
              </h3>
              <p className="text-gray-500">
                Aucune commande active pour ce type d'huîtres
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Résumé des paniers */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800 font-medium">
                    Total des paniers à préparer
                  </span>
                  <span className="text-2xl font-bold text-amber-600">
                    {orders
                      .filter((order) => order.status === "active")
                      .reduce((total, order) => {
                        const baskets = calculateBaskets(
                          order.oysterType,
                          order.quantity
                        );
                        return total + baskets;
                      }, 0)}
                  </span>
                </div>
              </div>

              {/* Liste des commandes actives */}
              <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                  Commandes actives
                </h3>
                <div className="space-y-3">
                  {orders
                    .filter((order) => order.status === "active")
                    .map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onOrderClick={onOrderClick}
                        onStatusChange={handleStatusChange}
                        showStatusToggle={false}
                      />
                    ))}
                  {orders.filter((order) => order.status === "active")
                    .length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune commande active pour ce type d'huîtres
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de fermeture */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasketOrdersModal;
