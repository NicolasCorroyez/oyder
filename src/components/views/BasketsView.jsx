import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  calculateBasketsSummary,
  oysterTypeLabels,
} from "../../utils/constants";

const BasketsView = ({ orders = [], onOrderClick }) => {
  const navigate = useNavigate();

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

  // Calculer le résumé des paniers pour les commandes actives du jour
  const basketsSummary = React.useMemo(() => {
    return calculateBasketsSummary(todayOrders);
  }, [todayOrders]);

  // Gestionnaire pour cliquer sur une carte de paniers
  const handleBasketClick = (oysterType) => {
    navigate(`/baskets/${todayString}/${oysterType}`);
  };

  const todayString = React.useMemo(() => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Résumé des paniers à préparer */}
      {basketsSummary.length > 0 ? (
        <div className="space-y-3">
          {basketsSummary.map((item) => (
            <div
              key={item.type}
              onClick={() => handleBasketClick(item.type)}
              className="bg-normal border-[0.1px] border-black rounded-[21px] overflow-hidden cursor-pointer hover:bg-yellow-500 transition-all duration-200 relative border-solid shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            >
              <div className="flex-1 min-w-0">
                {/* Partie haute - fond blanc */}
                <div className="pl-5 pt-2 h-12 ">
                  <div className="flex justify-between">
                    <div className="flex gap-2  items-center">
                      <span className="inline-block w-5 h-5 rounded-full border border-black bg-highlightblue"></span>
                      <h3 className="font-semibold text-xl">
                        {oysterTypeLabels[item.type] || item.type}
                      </h3>
                    </div>
                    <div className="pr-4">
                      <svg
                        className="w-8 h-8 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Partie basse - fond bleu */}
                <div className="bg-highlightblue p-2 pl-5 flex justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="text-white px-2 py-1 font-medium flex items-center justify-center">
                      {item.baskets}
                    </div>
                    <div className="text-white px-2 py-1 font-medium flex items-center justify-center">
                      {item.orders}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6 lg:py-8">
          Aucun panier à préparer pour aujourd'hui
        </p>
      )}

    </div>
  );
};

export default BasketsView;
