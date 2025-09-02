import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "🏠" },
    { path: "/calendar", label: "Calendrier", icon: "📅" },
    { path: "/orders/new", label: "Nouvelle", icon: "➕" },
    { path: "/overview", label: "Search", icon: "🔍" },
    { path: "/stats", label: "Stats", icon: "📊" },
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-between items-center py-4 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={() =>
                `flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 w-[calc(100%/5)] min-w-0 ${
                  isItemActive(item.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
            </NavLink>
          ))}
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
