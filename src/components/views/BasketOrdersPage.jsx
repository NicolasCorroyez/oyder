import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderCard from "../ui/OrderCard";
import BackButton from "../ui/BackButton";
import Navigation from "../ui/Navigation";
import { useOrders } from "../../hooks/useOrders";
import { oysterTypeLabels, calculateBaskets } from "../../utils/constants";

const BasketOrdersPage = () => {
  const { date, oysterType } = useParams();
  const navigate = useNavigate();
  const { orders, loadOrders } = useOrders();

  // Charger les commandes si nécessaire
  React.useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [orders.length, loadOrders]);

  // Filtrer les commandes
  const filteredOrders = React.useMemo(() => {
    if (!date || !oysterType) return [];
    return orders.filter(
      (order) =>
        order.pickupDate === date &&
        order.oysterType === oysterType &&
        order.status === "active" &&
        order.quantity > 0
    );
  }, [orders, date, oysterType]);

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

  const handleOrderClick = (order) => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-2 w-full pb-20">
          <div className="max-w-4xl mx-auto p-4 lg:p-6">
            {/* En-tête avec bouton retour */}
            <div className="mb-6">
              <BackButton />
            </div>

            {/* En-tête de la page */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Commandes {oysterTypeLabels[oysterType] || oysterType}
                </h2>
                {date && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(date)}
                  </p>
                )}
              </div>
            </div>

            {/* Contenu de la page */}
            <div className="space-y-6">
              {!filteredOrders || filteredOrders.length === 0 ? (
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
                        {filteredOrders
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
                      {filteredOrders
                        .filter((order) => order.status === "active")
                        .map((order) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onOrderClick={handleOrderClick}
                          />
                        ))}
                      {filteredOrders.filter(
                        (order) => order.status === "active"
                      ).length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          Aucune commande active pour ce type d'huîtres
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasketOrdersPage;
