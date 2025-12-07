import React from "react";
import { useAuth } from "../../hooks/useAuth";

const Header = ({ onLogout }) => {
  const { seller } = useAuth();

  return (
    <header className="h-32">
      <div className="flex items-center justify-between w-full h-full">
        {/* Logo et titre */}
        <div className="flex flex-col pl-6 pt-5">
          <h1 className="text-5xl font-bold ">Bonjour</h1>
          <h1 className="text-2xl pl-28">{seller?.displayName || "User"}</h1>
        </div>

        {/* Actions */}
        <div className="flex self-start mt-5 mr-5">
          {/* Avatar */}
          <div className="flex items-center justify-center bg-highlightblue rounded-full w-14 h-14">
            {/* Bouton déconnexion */}
            <button
              onClick={onLogout}
              className="text-white hover:text-white transition-colors p-1"
              title="Se déconnecter"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
