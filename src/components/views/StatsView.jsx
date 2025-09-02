import React, { useState, useMemo } from "react";
import {
  oysterTypeLabels,
  originLabels,
  locationLabels,
} from "../../utils/constants";

const StatsView = ({ orders = [] }) => {
  const [periodType, setPeriodType] = useState("month"); // "day", "month", "year", "custom"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Nouveaux filtres
  const [selectedOysterType, setSelectedOysterType] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");

  // État pour afficher/masquer les filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fonction pour filtrer les commandes selon tous les critères
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    let filtered = orders;

    // Filtre par période
    const now = new Date();
    let startDate, endDate;

    switch (periodType) {
      case "day":
        // Jour sélectionné
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "month":
        // Mois en cours par défaut
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;

      case "year":
        // Année en cours par défaut
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;

      case "custom":
        // Période personnalisée
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = null;
          endDate = null;
        }
        break;

      default:
        startDate = null;
        endDate = null;
    }

    // Appliquer le filtre de période
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.pickupDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Filtre par type d'huîtres
    if (selectedOysterType !== "all") {
      filtered = filtered.filter(
        (order) => order.oysterType === selectedOysterType
      );
    }

    // Filtre par origine
    if (selectedOrigin !== "all") {
      filtered = filtered.filter((order) => order.origin === selectedOrigin);
    }

    // Filtre par lieu de retrait
    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (order) => order.location === selectedLocation
      );
    }

    // Filtre par créateur
    if (selectedCreator !== "all") {
      filtered = filtered.filter(
        (order) => order.creatorId === selectedCreator
      );
    }

    return filtered;
  }, [
    orders,
    periodType,
    selectedDate,
    customStartDate,
    customEndDate,
    selectedOysterType,
    selectedOrigin,
    selectedLocation,
    selectedCreator,
  ]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    if (!filteredOrders.length) {
      return {
        total: 0,
        byStatus: { active: 0, recue: 0, annulee: 0 },
        byOysterType: {},
        byOrigin: {},
        byLocation: {},
        totalQuantity: 0,
        averageQuantity: 0,
      };
    }

    const stats = {
      total: filteredOrders.length,
      byStatus: { active: 0, recue: 0, annulee: 0 },
      byOysterType: {},
      byOrigin: {},
      byLocation: {},
      totalQuantity: 0,
      averageQuantity: 0,
    };

    filteredOrders.forEach((order) => {
      // Par statut
      if (stats.byStatus[order.status]) {
        stats.byStatus[order.status]++;
      }

      // Par type d'huîtres
      if (!stats.byOysterType[order.oysterType]) {
        stats.byOysterType[order.oysterType] = 0;
      }
      stats.byOysterType[order.oysterType]++;

      // Par origine
      if (!stats.byOrigin[order.origin]) {
        stats.byOrigin[order.origin] = 0;
      }
      stats.byOrigin[order.origin]++;

      // Par lieu
      if (!stats.byLocation[order.location]) {
        stats.byLocation[order.location] = 0;
      }
      stats.byLocation[order.location]++;

      // Quantité
      if (order.quantity) {
        stats.totalQuantity += parseInt(order.quantity) || 0;
      }
    });

    stats.averageQuantity =
      stats.total > 0 ? Math.round(stats.totalQuantity / stats.total) : 0;

    return stats;
  }, [filteredOrders]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-2 lg:p-2">
        <h1 className="text-l font-bold text-gray-900 flex justify-center">
          Statistiques
        </h1>
      </div>
      {/* Sélecteur de période */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sélectionner la période
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type de période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de période
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="month">Mois en cours</option>
              <option value="year">Année en cours</option>
              <option value="day">Jour spécifique</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>

          {/* Jour spécifique */}
          {periodType === "day" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un jour
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Période personnalisée - Date de début */}
          {periodType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Période personnalisée - Date de fin */}
          {periodType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Bouton pour afficher/masquer les filtres avancés */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <span>
              {showAdvancedFilters ? "Masquer" : "Afficher"} les filtres avancés
            </span>
            <span
              className={`transform transition-transform duration-200 ${
                showAdvancedFilters ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        {/* Filtres avancés (conditionnels) */}
        {showAdvancedFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par type d'huîtres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'huîtres
              </label>
              <select
                value={selectedOysterType}
                onChange={(e) => setSelectedOysterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="n2">Numéro 2</option>
                <option value="n3">Numéro 3</option>
                <option value="n4">Numéro 4</option>
                <option value="n1">Numéro 1</option>
                <option value="speciales">Spéciales</option>
              </select>
            </div>

            {/* Filtre par origine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origine
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les origines</option>
                <option value="standard">Standard</option>
                <option value="arguin">Arguin</option>
              </select>
            </div>

            {/* Filtre par lieu de retrait */}
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
                <option value="cabane">Cabane</option>
                <option value="marche_piraillan">Marché Piraillan</option>
                <option value="marche_cabreton">Marché Cabreton</option>
              </select>
            </div>

            {/* Filtre par créateur */}
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
          </div>
        )}

        {/* Bouton de réinitialisation des filtres */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSelectedOysterType("all");
              setSelectedOrigin("all");
              setSelectedLocation("all");
              setSelectedCreator("all");
              setPeriodType("month");
              setSelectedDate(new Date());
              setCustomStartDate("");
              setCustomEndDate("");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            🔄 Réinitialiser tous les filtres
          </button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vue d'ensemble
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.byStatus.active}
            </p>
            <p className="text-sm text-gray-600">Actives</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {stats.byStatus.recue}
            </p>
            <p className="text-sm text-gray-600">Récupérées</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {stats.byStatus.annulee}
            </p>
            <p className="text-sm text-gray-600">Annulées</p>
          </div>
        </div>
      </div>

      {/* Statistiques par type d'huîtres */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par type d'huîtres
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byOysterType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-700">
                {oysterTypeLabels[type] || type}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques par origine */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par origine
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byOrigin).map(([origin, count]) => (
            <div key={origin} className="flex items-center justify-between">
              <span className="text-gray-700">
                {originLabels[origin] || origin}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques par lieu */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition par lieu de retrait
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byLocation).map(([location, count]) => (
            <div key={location} className="flex items-center justify-between">
              <span className="text-gray-700">
                {locationLabels[location] || location}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques de quantité */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Statistiques de quantité (en douzaines)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.totalQuantity}
            </p>
            <p className="text-sm text-gray-600">Douzaines totales</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {stats.averageQuantity}
            </p>
            <p className="text-sm text-gray-600">Douzaines moyennes</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Nombre de commandes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
