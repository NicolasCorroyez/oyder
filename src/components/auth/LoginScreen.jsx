import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { verifySellerPin, signInAnonymously } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pin || pin.length < 4) {
      setError("Le code doit contenir au moins 4 chiffres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Connexion anonyme Firebase
      await signInAnonymously();

      // 2. Vérification du PIN vendeur
      await verifySellerPin(pin);

      // 3. Redirection vers le dashboard
      navigate("/");
    } catch (error) {
      console.error("Erreur connexion:", error);
      setError(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Seulement les chiffres
    setPin(value);
    setError(""); // Effacer l'erreur quand l'utilisateur tape
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oyder</h1>
          <p className="text-gray-600">Gestion des commandes d'huîtres</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Code vendeur
            </label>
            <input
              id="pin"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handlePinChange}
              placeholder="Entrez votre code à 4 chiffres"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              maxLength={4}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Contactez l'administrateur pour obtenir votre code
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
