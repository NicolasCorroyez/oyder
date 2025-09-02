import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Header = ({ onLogout }) => {
  const { seller } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <div className="text-xl lg:text-2xl mr-2 lg:mr-3">🦪</div>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900">
              Oyder
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Informations vendeur */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Nom du vendeur - caché sur très petit écran */}
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-medium text-gray-900">
                  {seller?.displayName}
                </p>
                <p className="text-xs text-gray-500">Vendeur</p>
              </div>

              {/* Avatar */}
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs lg:text-sm font-medium text-blue-600">
                  {seller?.displayName?.charAt(0)?.toUpperCase()}
                </span>
              </div>

              {/* Bouton déconnexion */}
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Se déconnecter"
              >
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
