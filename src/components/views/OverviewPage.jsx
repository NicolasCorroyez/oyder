import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OverviewView from "./OverviewView";
import Navigation from "../ui/Navigation";
import { useOrders } from "../../hooks/useOrders";

const OverviewPage = () => {
  const navigate = useNavigate();
  const { orders, loadOrders } = useOrders();

  // Charger les commandes si nécessaire
  useEffect(() => {
    if (orders.length === 0) {
      loadOrders();
    }
  }, [orders.length, loadOrders]);

  const handleOrderClick = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleEditOrder = (orderId) => {
    navigate(`/orders/${orderId}/edit`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-2 w-full pb-20">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Contenu */}
            <OverviewView
              orders={orders}
              onOrderClick={handleOrderClick}
              onEditOrder={handleEditOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

