import React from "react";
import OrderCard from "../ui/OrderCard";
import { useOrders } from "../../hooks/useOrders";

const CalendarView = ({ orders, selectedDate, onDateSelect }) => {
  const { updateOrder } = useOrders();
  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold mb-3">Calendrier</h3>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, index) => (
            <div
              key={`day-header-${index}`}
              className="text-center text-sm font-medium p-2"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const date = new Date(2024, 0, i + 1);
            const dayOrders = orders.filter(
              (order) => order.pickupDate === date.toISOString().split("T")[0]
            );
            return (
              <div
                key={`day-${i}`}
                className="text-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                onClick={() => onDateSelect(date)}
              >
                <div className="text-sm">{i + 1}</div>
                {dayOrders.length > 0 && (
                  <div className="text-xs bg-blue-100 text-blue-800 rounded-full px-1">
                    {dayOrders.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3">
            Commandes du {selectedDate.toLocaleDateString("fr-FR")}
          </h3>
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <div className="space-y-3">
              {orders
                .filter(
                  (order) =>
                    order.pickupDate ===
                    selectedDate.toISOString().split("T")[0]
                )
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOrderClick={() => {}} // Pas de clic sur les cartes du calendrier
                    onStatusChange={handleStatusChange}
                    showStatusToggle={true}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
