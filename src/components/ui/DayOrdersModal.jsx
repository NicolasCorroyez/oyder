import React from "react";
import OrderCard from "./OrderCard";
import { useOrders } from "../../hooks/useOrders";

const DayOrdersModal = ({
  isOpen,
  onClose,
  dayOrders,
  selectedDate,
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

  if (!isOpen || !dayOrders) return null;

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
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
              {/* Statistiques du jour */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800 font-medium">
                    Total du jour
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {dayOrders.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {dayOrders.filter((o) => o.status === "active").length}
                    </div>
                    <div className="text-blue-500">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">
                      {dayOrders.filter((o) => o.status === "recue").length}
                    </div>
                    <div className="text-green-500">Récupérée</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">
                      {dayOrders.filter((o) => o.status === "annulee").length}
                    </div>
                    <div className="text-red-500">Annulée</div>
                  </div>
                </div>
              </div>

              {/* Liste des commandes */}
              <div className="space-y-3 pb-12">
                {dayOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOrderClick={onOrderClick}
                    onStatusChange={handleStatusChange}
                    showStatusToggle={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayOrdersModal;
