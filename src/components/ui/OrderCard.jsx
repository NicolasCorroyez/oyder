import React from "react";
import {
  oysterTypeLabels,
  originLabels,
  locationLabels,
  statusLabels,
} from "../../utils/constants";

const OrderCard = ({
  order,
  onOrderClick,
  onStatusChange,
  showStatusToggle = true,
}) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleStatusToggle = (e) => {
    e.stopPropagation();
    if (!onStatusChange) return;

    if (order.status === "active") {
      onStatusChange(order, "recue");
    } else if (order.status === "recue") {
      onStatusChange(order, "active");
    }
  };

  return (
    <div
      onClick={() => onOrderClick && onOrderClick(order)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base mb-2">
            {order.clientName}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="text-blue-500 mr-2">🕐</span>
              {formatDate(order.pickupDate)} - {order.pickupTime}
            </div>

            <div className="flex items-center text-gray-600">
              <span className="text-green-500 mr-2">📍</span>
              {locationLabels[order.location] || order.location}
            </div>

            <div className="flex items-center space-x-2 text-gray-600 text-xs">
              <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200 font-medium">
                {order.quantity}dz
              </div>
              <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded border border-orange-200 font-medium">
                {oysterTypeLabels[order.oysterType]?.includes("Numéro")
                  ? `N°${oysterTypeLabels[order.oysterType].split(" ")[1]}`
                  : (oysterTypeLabels[order.oysterType] || order.oysterType)
                      .slice(0, 3)
                      .toUpperCase()}
              </div>
              <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200 font-medium">
                {(originLabels[order.origin] || order.origin)
                  .slice(0, 3)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center ml-4">
          <div className="flex items-center space-x-2">
            {showStatusToggle ? (
              order.status === "annulee" ? (
                <span
                  className={`px-3 py-2 text-xs font-medium rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              ) : (
                <span
                  onClick={handleStatusToggle}
                  className={`px-2 py-6 text-xs font-medium rounded-lg cursor-pointer transition-colors ${getStatusColor(
                    order.status
                  )} hover:opacity-80`}
                  title={
                    order.status === "active"
                      ? "Cliquer pour marquer comme récupérée"
                      : order.status === "recue"
                      ? "Cliquer pour remettre en active"
                      : "Commande annulée"
                  }
                >
                  {statusLabels[order.status] || order.status}
                </span>
              )
            ) : (
              <span
                className={`px-3 py-6 text-xs font-medium rounded-lg ${getStatusColor(
                  order.status
                )}`}
              >
                {statusLabels[order.status] || order.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
