import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { statusLabels } from "../../utils/constants";

const CreatorsView = ({ orders = [] }) => {
  const { seller } = useAuth();
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "annulee":
        return "bg-red-100 text-red-800";
      case "recue":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Grouper les commandes par créateur
  const ordersByCreator = orders.reduce((acc, order) => {
    if (!acc[order.creatorId]) {
      acc[order.creatorId] = [];
    }
    acc[order.creatorId].push(order);
    return acc;
  }, {});

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    if (selectedCreator !== "all" && order.creatorId !== selectedCreator)
      return false;
    if (selectedStatus !== "all" && order.status !== selectedStatus)
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Commandes par créateur
        </h1>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Créateur
            </label>
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les créateurs</option>
              <option value={seller?.id}>Mes commandes</option>
              {Object.keys(ordersByCreator).map((creatorId) => (
                <option key={creatorId} value={creatorId}>
                  {creatorId === seller?.id
                    ? "Moi"
                    : `Vendeur ${creatorId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">{statusLabels.active}</option>
              <option value="annulee">{statusLabels.annulee}</option>
              <option value="recue">{statusLabels.recue}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques par créateur */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par créateur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(ordersByCreator).map(([creatorId, creatorOrders]) => (
            <div key={creatorId} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                {creatorId === seller?.id
                  ? "Mes commandes"
                  : `Vendeur ${creatorId.slice(0, 8)}`}
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {creatorOrders.length}
              </p>
              <p className="text-sm text-gray-600">commandes</p>

              {/* Détail des statuts */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Active:</span>
                  <span className="font-medium">
                    {creatorOrders.filter((o) => o.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Récupérée:</span>
                  <span className="font-medium">
                    {creatorOrders.filter((o) => o.status === "recue").length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Annulée:</span>
                  <span className="font-medium">
                    {creatorOrders.filter((o) => o.status === "annulee").length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des commandes filtrées */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Commandes ({filteredOrders.length})
        </h3>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune commande trouvée avec ces filtres
          </p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {order.clientName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.pickupDate} à {order.pickupTime}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Créé par:{" "}
                      {order.creatorId === seller?.id
                        ? "Moi"
                        : `Vendeur ${order.creatorId.slice(0, 8)}`}
                    </p>
                    {order.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsView;
