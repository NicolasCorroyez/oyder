import React from "react";
import {
  oysterTypeLabels,
  originLabels,
  locationLabels,
  calculateBaskets,
} from "../../utils/constants";

const OrderCard = ({ order, onOrderClick }) => {
  const isDelivered = order.status === "recue";

  return (
    <div
      onClick={() => onOrderClick && onOrderClick(order)}
      className={`bg-normal border-[0.1px] border-black rounded-[21px] overflow-hidden cursor-pointe ${
        isDelivered
          ? "border-dashed"
          : "border-solid shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      }`}
    >
      <div className="flex-1 min-w-0">
        {/* Partie haute - fond blanc */}
        <div className="pl-5 pt-2 h-12 ">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center min-w-0 flex-1">
              <span
                className={`inline-block w-5 h-5 rounded-full border border-black flex-shrink-0 ${
                  isDelivered ? "bg-transparent" : "bg-highlightblue"
                }`}
              ></span>
              <h3
                className="font-semibold truncate"
                style={{
                  fontSize: `clamp(0.875rem, ${
                    1.25 -
                    Math.min((order.clientName?.length || 0) * 0.015, 0.5)
                  }rem, 1.25rem)`,
                }}
              >
                {order.clientName}
              </h3>
            </div>
            <div className="pr-4 flex-shrink-0">
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
            <div className="text-white px-2 py-1 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              {order.quantity}
            </div>
            <div className="text-white px-2 py-1 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {calculateBaskets(order.oysterType, order.quantity)}
            </div>
            <div className="text-white px-2 py-1 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {oysterTypeLabels[order.oysterType]?.includes("Numéro")
                ? `N°${oysterTypeLabels[order.oysterType].split(" ")[1]}`
                : (oysterTypeLabels[order.oysterType] || order.oysterType)
                    .slice(0, 3)
                    .toUpperCase()}
            </div>
            <div className="text-white px-2 py-1 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {(originLabels[order.origin] || order.origin)
                .slice(0, 3)
                .toUpperCase()}
            </div>
            <div className="text-white px-2 py-1 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {(locationLabels[order.location] || order.location)
                .slice(0, 3)
                .toUpperCase()}
            </div>
          </div>
          <div className="text-white px-2 py-1 font-medium flex items-center justify-center pr-5 text-sm gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            {order.pickupTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
