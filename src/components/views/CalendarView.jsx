import React, { useState, useMemo } from "react";
import DayOrdersModal from "../ui/DayOrdersModal";

const CalendarView = ({ orders = [], onOrderClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  // Grouper les commandes par date
  const ordersByDate = useMemo(() => {
    const grouped = {};

    orders.forEach((order) => {
      const dateKey = order.pickupDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
    });

    return grouped;
  }, [orders]);

  // Ouvrir la modale d'un jour
  const openDayModal = (day) => {
    setSelectedDay(day);
    setIsDayModalOpen(true);
  };

  // Fermer la modale d'un jour
  const closeDayModal = () => {
    setIsDayModalOpen(false);
    setSelectedDay(null);
  };

  // Générer les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Ajouter les jours du mois précédent pour remplir la première semaine
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* En-tête du calendrier */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
            Calendrier
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-base lg:text-lg font-semibold text-gray-900 min-w-[150px] lg:min-w-[200px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 lg:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours */}
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div
              key={day}
              className="p-1 lg:p-2 text-center text-xs lg:text-sm font-medium text-gray-500 bg-gray-50 rounded"
            >
              {day}
            </div>
          ))}

          {/* Jours du mois */}
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="p-1 lg:p-2 bg-gray-50 rounded min-h-[60px] lg:min-h-[80px]"
                ></div>
              );
            }

            const dateKey = formatDate(day);
            const dayOrders = ordersByDate[dateKey] || [];
            const isToday = formatDate(new Date()) === dateKey;

            return (
              <div
                key={dateKey}
                className={`p-1 lg:p-2 border rounded min-h-[60px] lg:min-h-[80px] ${
                  isToday
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Numéro du jour */}
                <div
                  className={`text-xs lg:text-sm font-medium mb-1 ${
                    isToday ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>

                {/* Bulle avec nombre de commandes actives */}
                {(() => {
                  const activeOrders = dayOrders.filter(
                    (order) => order.status === "active"
                  );
                  return activeOrders.length > 0 ? (
                    <div
                      onClick={() => openDayModal(day)}
                      className="mt-2 cursor-pointer group"
                    >
                      <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-colors mx-auto">
                        {activeOrders.length}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <p className="text-xs text-gray-500 mt-2">
          Les bulles bleues montrent le nombre de commandes actives. Cliquez
          pour voir toutes les commandes du jour.
        </p>
      </div>

      {/* Modale des commandes du jour */}
      <DayOrdersModal
        isOpen={isDayModalOpen}
        onClose={closeDayModal}
        dayOrders={
          selectedDay ? ordersByDate[formatDate(selectedDay)] || [] : []
        }
        selectedDate={selectedDay ? formatDate(selectedDay) : null}
        onOrderClick={onOrderClick}
      />
    </div>
  );
};

export default CalendarView;
