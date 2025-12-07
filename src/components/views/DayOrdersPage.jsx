import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderCard from "../ui/OrderCard";
import BackButton from "../ui/BackButton";
import Navigation from "../ui/Navigation";
import { useOrders } from "../../hooks/useOrders";
import {
  calculateBasketsSummary,
  oysterTypeLabels,
} from "../../utils/constants";

const DayOrdersPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { orders, loadOrders } = useOrders();

  // Charger les commandes si nécessaire
  React.useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [orders.length, loadOrders]);

  // Filtrer les commandes du jour sélectionné
  const dayOrders = React.useMemo(() => {
    if (!date) return [];
    return orders.filter((order) => order.pickupDate === date);
  }, [orders, date]);

  // Calculer le résumé des paniers pour les commandes actives du jour
  const basketsSummary = calculateBasketsSummary(dayOrders);

  // Gestionnaire pour cliquer sur une carte de paniers
  const handleBasketClick = (oysterType) => {
    navigate(`/baskets/${date}/${oysterType}`);
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
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(date)}
              </h2>
            </div>

            {/* Contenu de la page */}
            <div className="space-y-6">
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
                                  {item.orders} commande
                                  {item.orders > 1 ? "s" : ""}
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
                            onOrderClick={handleOrderClick}
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
        </div>
      </div>
    </div>
  );
};

export default DayOrdersPage;
