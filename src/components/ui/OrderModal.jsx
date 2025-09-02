import React, { useState } from "react";
import { X, Edit, Save, X as CancelIcon } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import {
  isValidQuantity,
  getQuantityErrorMessage,
} from "../../utils/quantityUtils";
import {
  statusLabels,
  oysterTypeLabels,
  originLabels,
} from "../../utils/constants";

const OrderModal = ({ order, isOpen, onClose }) => {
  const { updateOrder } = useOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  if (!isOpen || !order) return null;

  // Initialiser le formulaire quand on passe en mode édition
  const handleEdit = () => {
    // Empêcher l'édition si la commande est annulée
    if (order.status === "annulee") {
      return;
    }

    setIsEditing(true);
    setFormData({
      clientName: order.clientName || "",
      clientPhone: order.clientPhone || "",
      oysterType: order.oysterType || "n3",
      origin: order.origin || "standard",
      pickupDate: order.pickupDate || "",
      pickupTime: order.pickupTime || "",
      location: order.location || "cabane",
      notes: order.notes || "",
      quantity: order.quantity || "",
    });
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({});
    setError("");
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validation de la quantité
    if (!isValidQuantity(formData.quantity)) {
      setError(getQuantityErrorMessage(formData.quantity));
      return;
    }

    try {
      const orderData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updateOrder(order.id, orderData);
      setIsEditing(false);
      setFormData({});
      setError("");
      onClose(); // Fermer la modale après sauvegarde
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Erreur lors de la sauvegarde de la commande");
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        await updateOrder(order.id, {
          ...order,
          status: "annulee",
          updatedAt: new Date().toISOString(),
        });
        onClose(); // Fermer la modale après annulation
      } catch (error) {
        console.error("Erreur lors de l'annulation:", error);
        setError("Erreur lors de l'annulation de la commande");
      }
    }
  };

  const handleReactivateOrder = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réactiver cette commande ?")) {
      try {
        await updateOrder(order.id, {
          ...order,
          status: "active",
          updatedAt: new Date().toISOString(),
        });
        onClose(); // Fermer la modale après réactivation
      } catch (error) {
        console.error("Erreur lors de la réactivation:", error);
        setError("Erreur lors de la réactivation de la commande");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Non spécifié";
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête de la modale */}
        <div className="p-6 border-b border-gray-200">
          {/* En-tête avec titre et croix */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Modifier la commande" : "Détails de la commande"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Boutons d'action sous le titre */}
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Save size={16} />
                  <span>Confirmer</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                >
                  <CancelIcon size={16} />
                  <span>Annuler</span>
                </button>
              </>
            ) : (
              <>
                {/* Bouton Modifier - seulement si la commande n'est pas annulée */}
                {order.status !== "annulee" && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Edit size={16} />
                    <span>Modifier</span>
                  </button>
                )}

                {/* Bouton Annuler la commande - seulement si la commande n'est pas annulée */}
                {order.status !== "annulee" && (
                  <button
                    onClick={handleCancelOrder}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <CancelIcon size={16} />
                    <span>Annuler</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Contenu de la modale */}
        <div className="p-6 space-y-6">
          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Informations client */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-blue-500 mr-2">👤</span>
              Informations client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Nom du client
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.clientName || ""}
                    onChange={(e) =>
                      handleFormChange("clientName", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{order.clientName}</p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Téléphone
                </span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.clientPhone || ""}
                    onChange={(e) =>
                      handleFormChange("clientPhone", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">
                    {order.clientPhone || "Non spécifié"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-orange-500 mr-2">🦪</span>
              Détails de la commande
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Type d'huîtres
                </span>
                {isEditing ? (
                  <select
                    value={formData.oysterType || "n3"}
                    onChange={(e) =>
                      handleFormChange("oysterType", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  >
                    <option value="n3">Numéro 3</option>
                    <option value="n4">Numéro 4</option>
                    <option value="n2">Numéro 2</option>
                    <option value="n1">Numéro 1</option>
                    <option value="speciales">Spéciales</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {oysterTypeLabels[order.oysterType] || order.oysterType}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Origine
                </span>
                {isEditing ? (
                  <select
                    value={formData.origin || "standard"}
                    onChange={(e) => handleFormChange("origin", e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="arguin">Arguin</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {originLabels[order.origin] || order.origin}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Quantité
                </span>
                {isEditing ? (
                  <div>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={formData.quantity || ""}
                      onChange={(e) =>
                        handleFormChange("quantity", e.target.value)
                      }
                      placeholder="1.5"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum : 1/2 douzaine (0.5)
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {order.quantity
                      ? `${order.quantity} douzaine${
                          order.quantity > 1 ? "s" : ""
                        }`
                      : "Non spécifiée"}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Lieu de retrait
                </span>
                {isEditing ? (
                  <select
                    value={formData.location || "cabane"}
                    onChange={(e) =>
                      handleFormChange("location", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  >
                    <option value="cabane">Cabane</option>
                    <option value="marche_piraillan">Marché Piraillan</option>
                    <option value="marche_cabreton">Marché Cabreton</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {(() => {
                      const labels = {
                        cabane: "Cabane",
                        marche_piraillan: "Marché Piraillan",
                        marche_cabreton: "Marché Cabreton",
                      };
                      return labels[order.location] || order.location;
                    })()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dates et statut */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-purple-500 mr-2">📅</span>
              Planning et statut
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Date de livraison
                </span>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.pickupDate || ""}
                    onChange={(e) =>
                      handleFormChange("pickupDate", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {formatDate(order.pickupDate)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Heure de livraison
                </span>
                {isEditing ? (
                  <input
                    type="time"
                    value={formData.pickupTime || ""}
                    onChange={(e) =>
                      handleFormChange("pickupTime", e.target.value)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {formatTime(order.pickupTime)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">
                  Statut
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          {order.deliveryAddress && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-green-500 mr-2">📍</span>
                Adresse de livraison
              </h3>
              <p className="text-gray-900">{order.deliveryAddress}</p>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-yellow-500 mr-2">📝</span>
              Notes
            </h3>
            {isEditing ? (
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                rows={3}
                placeholder="Ajouter des notes..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{order.notes || "Aucune note"}</p>
            )}
          </div>

          {/* Informations système */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-gray-500 mr-2">⚙️</span>
              Informations système
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">ID commande</span>
                <p className="text-gray-900 font-mono">{order.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Créée le</span>
                <p className="text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          {/* Bouton de réactivation pour les commandes annulées */}
          {order.status === "annulee" && (
            <button
              onClick={handleReactivateOrder}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <span>✅</span>
              <span>Réactiver la commande</span>
            </button>
          )}

          {/* Bouton de fermeture */}
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

export default OrderModal;
