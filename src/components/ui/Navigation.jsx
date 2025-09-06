import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
    },
    {
      path: "/calendar",
      label: "Calendrier",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      path: "/orders/new",
      label: "Nouvelle",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      path: "/overview",
      label: "Search",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      path: "/stats",
      label: "Stats",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  // Fonction personnalisée pour déterminer si un onglet est actif
  const isItemActive = (itemPath) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    if (itemPath === "/orders") {
      // L'onglet "Toutes" est actif seulement si on est exactement sur /orders
      // et pas sur /orders/new ou /orders/:id
      return location.pathname === "/orders";
    }
    // Pour les autres onglets, utiliser la logique normale
    return location.pathname === itemPath;
  };

  return (
    <>
      {/* Navigation mobile (barre en bas) */}
      <nav className="lg:hidden fixed h-16 bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50 rounded-t-3xl">
        <div className="flex justify-between items-end py-2 px-4 pb-4 ">
          {navItems.map((item) => {
            const isActive = isItemActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center transition-all duration-300 ease-out w-[calc(100%/5)] min-w-0 h-10 pb-2"
              >
                {/* Conteneur de l'icône avec animation */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ease-out ${
                    isActive ? "-translate-y-2" : "translate-y-0"
                  }`}
                >
                  {/* Cercle de fond pour l'onglet actif */}
                  <div
                    className={`absolute w-12 h-12 rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "bg-blue-500 shadow-lg shadow-blue-500/30 scale-100"
                        : "bg-transparent scale-0"
                    }`}
                  />

                  {/* Icône */}
                  <span
                    className={`relative transition-all duration-300 ease-out ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Navigation desktop (latérale) */}
      <nav className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
        <div className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={() =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isItemActive(item.path)
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
