import React, { useEffect } from "react";
import StatsView from "./StatsView";
import Navigation from "../ui/Navigation";
import { useOrders } from "../../hooks/useOrders";

const StatsPage = () => {
  const { orders, loadOrders } = useOrders();

  // Charger les commandes si nécessaire
  useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [orders.length, loadOrders]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-2 w-full pb-20">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Contenu */}
            <StatsView orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;

