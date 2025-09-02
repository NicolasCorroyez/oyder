import React, { useState, useMemo } from "react";
import OrderCard from "../ui/OrderCard";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import {
  oysterTypeLabels,
  originLabels,
  locationLabels,
  statusLabels,
} from "../../utils/constants";

const OverviewView = ({ orders = [], onOrderClick }) => {
  const { seller } = useAuth();
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

  // États de recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOysterType, setSelectedOysterType] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");

  // Période par défaut : entre il y a 15 jours et dans 15 jours
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split("T")[0];
  });

  // État pour afficher/masquer les filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fonction de recherche et filtrage
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    return orders.filter((order) => {
      // Filtre par période
      const orderDate = new Date(order.pickupDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (orderDate < start || orderDate > end) return false;

      // Filtre par terme de recherche (nom du client)
      if (
        searchTerm &&
        !order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filtre par lieu
      if (selectedLocation !== "all" && order.location !== selectedLocation) {
        return false;
      }

      // Filtre par créateur
      if (selectedCreator !== "all" && order.creatorId !== selectedCreator) {
        return false;
      }

      // Filtre par statut
      if (selectedStatus !== "all" && order.status !== selectedStatus) {
        return false;
      }

      // Filtre par type d'huîtres
      if (
        selectedOysterType !== "all" &&
        order.oysterType !== selectedOysterType
      ) {
        return false;
      }

      // Filtre par origine
      if (selectedOrigin !== "all" && order.origin !== selectedOrigin) {
        return false;
      }

      return true;
    });
  }, [
    orders,
    searchTerm,
    selectedLocation,
    selectedCreator,
    selectedStatus,
    selectedOysterType,
    selectedOrigin,
    startDate,
    endDate,
  ]);

  // Fonction de réinitialisation des filtres
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedCreator("all");
    setSelectedStatus("all");
    setSelectedOysterType("all");
    setSelectedOrigin("all");

    // Remettre la période par défaut
    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - 15);
    const end = new Date();
    end.setDate(now.getDate() + 15);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
        <h1 className="text-l font-semibold text-gray-900 flex items-center justify-center">
          Recherche avancée
        </h1>
      </div>
      {/* Zone de recherche principale */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        {/* Recherche par nom */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher par nom de client
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Entrez le nom du client..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm text-lg"
          />
        </div>

        {/* Période */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Période de recherche
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1">Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Bouton pour afficher/masquer les filtres avancés */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span>{showAdvancedFilters ? "▼" : "▶"}</span>
            <span>
              {showAdvancedFilters
                ? "Masquer les filtres avancés"
                : "Afficher plus de filtres"}
            </span>
          </button>
        </div>

        {/* Filtres avancés (conditionnels) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Filtre par lieu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Lieu de retrait
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="all">Tous les lieux</option>
                {Object.entries(locationLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par créateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Créateur
              </label>
              <select
                value={selectedCreator}
                onChange={(e) => setSelectedCreator(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="all">Tous les créateurs</option>
                <option value={seller?.id}>Mes commandes</option>
                {(() => {
                  const creators = [
                    ...new Set(orders.map((order) => order.creatorId)),
                  ];
                  return creators.map((creatorId) => (
                    <option key={creatorId} value={creatorId}>
                      Vendeur {creatorId.slice(0, 8)}
                    </option>
                  ));
                })()}
              </select>
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏷️ Statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="all">Tous les statuts</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par type d'huîtres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🦪 Type d'huîtres
              </label>
              <select
                value={selectedOysterType}
                onChange={(e) => setSelectedOysterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="all">Tous les types</option>
                {Object.entries(oysterTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par origine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 Origine
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="all">Toutes les origines</option>
                {Object.entries(originLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Bouton de réinitialisation */}
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des commandes trouvées */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          Commandes trouvées ({filteredOrders.length})
        </h3>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              🔍 Aucune commande trouvée
            </p>
            <p className="text-gray-400 text-sm">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
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
    </div>
  );
};

export default OverviewView;
