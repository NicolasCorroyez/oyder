import React, { useState } from "react";
import { locationLabels, statusLabels } from "../../utils/constants";

const PlacesView = ({ orders = [] }) => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Calculer les statistiques localement
  const stats = React.useMemo(() => {
    const stats = {
      total: orders.length,
      active: orders.filter((o) => o.status === "active").length,
      cancelled: orders.filter((o) => o.status === "annulee").length,
      completed: orders.filter((o) => o.status === "recue").length,
      byLocation: {},
      byType: {},
    };

    orders.forEach((order) => {
      // Par lieu
      if (!stats.byLocation[order.location]) {
        stats.byLocation[order.location] = 0;
      }
      stats.byLocation[order.location]++;
    });

    return stats;
  }, [orders]);

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

  // Filtrer les commandes
  const filteredOrders = orders.filter((order) => {
    if (selectedLocation !== "all" && order.location !== selectedLocation)
      return false;
    if (selectedStatus !== "all" && order.status !== selectedStatus)
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Commandes par lieu
      </h1>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu de retrait
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les lieux</option>
              <option value="cabane">{locationLabels.cabane}</option>
              <option value="marche_piraillan">
                {locationLabels.marche_piraillan}
              </option>
              <option value="marche_cabreton">
                {locationLabels.marche_cabreton}
              </option>
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
              <option value="active">Active</option>
              <option value="annulee">Annulée</option>
              <option value="recue">Récupérée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques par lieu */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par lieu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.byLocation).map(([location, count]) => (
            <div
              key={location}
              className="bg-gray-50 rounded-lg p-4 text-center"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                {locationLabels[location] || location}
              </h4>
              <p className="text-2xl font-bold text-blue-600">{count}</p>
              <p className="text-sm text-gray-600">commandes</p>
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
                      {order.pickupDate} à {order.pickupTime} -{" "}
                      {locationLabels[order.location] || order.location}
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

export default PlacesView;
