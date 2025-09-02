import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { useAuth } from "../../hooks/useAuth";
import {
  oysterTypeLabels,
  originLabels,
  locationLabels,
} from "../../utils/constants";
import {
  isValidQuantity,
  getQuantityErrorMessage,
} from "../../utils/quantityUtils";

const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createOrder, updateOrder, orders } = useOrders();
  const { seller } = useAuth();

  // Trouver la commande à éditer si on a un ID
  const editingOrder = id ? orders.find((o) => o.id === id) : null;

  // État initial du formulaire
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    oysterType: "n3",
    origin: "standard",
    pickupDate: "",
    pickupTime: "",
    location: "cabane",
    notes: "",
    quantity: "",
  });

  // État pour les erreurs et succès
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialiser le formulaire si on édite une commande
  useEffect(() => {
    if (editingOrder) {
      setFormData({
        clientName: editingOrder.clientName || "",
        clientPhone: editingOrder.clientPhone || "",
        oysterType: editingOrder.oysterType || "n3",
        origin: editingOrder.origin || "standard",
        pickupDate: editingOrder.pickupDate || "",
        pickupTime: editingOrder.pickupTime || "",
        location: editingOrder.location || "cabane",
        notes: editingOrder.notes || "",
        quantity: editingOrder.quantity || "",
      });
    }
  }, [editingOrder]);

  // Faire disparaître automatiquement les messages d'erreur après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Gérer les changements de champs
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les messages
    setError("");
    setSuccess("");

    // Validation de la quantité
    if (!isValidQuantity(formData.quantity)) {
      setError(getQuantityErrorMessage(formData.quantity));
      return;
    }

    try {
      const orderData = {
        ...formData,
        creatorId: seller?.id,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
        setSuccess("Commande mise à jour avec succès !");
      } else {
        await createOrder(orderData);
        setSuccess("Commande créée avec succès !");
      }

      // Faire disparaître la modale après 2 secondes
      setTimeout(() => {
        setSuccess("");
      }, 2000);

      // Rediriger vers le dashboard après 2.5 secondes
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(
        "Erreur lors de la sauvegarde de la commande. Veuillez réessayer."
      );
    }
  };

  // Gérer l'annulation
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
        <h1 className="text-l font-semibold text-gray-900 flex items-center justify-center">
          {editingOrder ? "Modifier la commande" : "Nouvelle commande"}
        </h1>
      </div>

      {/* Formulaire */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations client */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-blue-500 mr-3">👤</span>
              Informations client
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    handleFormChange("clientName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) =>
                    handleFormChange("clientPhone", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-orange-500 mr-3">🦪</span>
              Détails de la commande
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Type d'huîtres *
                </label>
                <select
                  value={formData.oysterType}
                  onChange={(e) =>
                    handleFormChange("oysterType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                >
                  {Object.entries(oysterTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Origine *
                </label>
                <select
                  value={formData.origin}
                  onChange={(e) => handleFormChange("origin", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                >
                  {Object.entries(originLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantité (en douzaines) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleFormChange("quantity", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                    min="0.5"
                    step="0.5"
                    placeholder="1.5"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                    dz
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Minimum : 1/2 douzaine (0.5). Exemple : 1.5 = 1 douzaine et
                  demie
                </p>
              </div>
            </div>
          </div>

          {/* Planning et retrait */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-purple-500 mr-3">📅</span>
              Planning et retrait
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Date de retrait *
                </label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) =>
                    handleFormChange("pickupDate", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Heure de retrait *
                </label>
                <input
                  type="time"
                  value={formData.pickupTime}
                  onChange={(e) =>
                    handleFormChange("pickupTime", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Lieu de retrait *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                  required
                >
                  {Object.entries(locationLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-yellow-500 mr-3">📝</span>
              Notes
            </h3>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              placeholder="Informations supplémentaires..."
            />
          </div>

          {/* Modale de notification */}
          {(error || success) && (
            <div
              className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
                error || success ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div
                className={`px-6 py-4 rounded-lg shadow-lg border-2 min-w-[300px] max-w-[500px] ${
                  error
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-green-50 border-green-300 text-green-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{error ? "❌" : "✅"}</span>
                    <p className="font-medium">{error || success}</p>
                  </div>
                  <button
                    onClick={() => {
                      setError("");
                      setSuccess("");
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {editingOrder ? "Mettre à jour" : "Créer la commande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
