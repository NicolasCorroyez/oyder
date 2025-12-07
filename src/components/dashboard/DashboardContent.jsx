import React from "react";
import OrderCard from "../ui/OrderCard";

const DashboardContent = ({ orders = [], onOrderClick }) => {
  // Calculer les commandes du jour
  const todayOrders = React.useMemo(() => {
    const today = new Date();
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    return orders.filter((order) => {
      return order.pickupDate === todayString;
    });
  }, [orders]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Dernières commandes */}
      {todayOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-6 lg:py-8">
          Aucune commande prévue pour aujourd'hui
        </p>
      ) : (
        <div className="space-y-3">
          {todayOrders.slice(0, 5).map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOrderClick={onOrderClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
