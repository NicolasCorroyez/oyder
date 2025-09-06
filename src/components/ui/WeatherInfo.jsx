import React, { useState, useEffect } from "react";

const WeatherInfo = () => {
  // Récupérer les dernières données connues depuis localStorage
  const getLastKnownWeather = () => {
    try {
      const saved = localStorage.getItem("weatherData");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error);
    }
    // Données par défaut si rien n'est sauvegardé
    return {
      temperature: 18,
      windSpeed: 12,
      condition: "partiellement nuageux",
      humidity: 65,
      pressure: 1013,
    };
  };

  const [weatherData, setWeatherData] = useState(getLastKnownWeather);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // API wttr.in gratuite et sans clé pour Piraillan
        const response = await fetch(
          "https://wttr.in/Piraillan?format=j1&lang=fr"
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données météo");
        }

        const data = await response.json();

        // Extraire les données pertinentes
        const current = data.current_condition[0];
        const weather = {
          temperature: parseInt(current.temp_C),
          windSpeed: parseInt(current.windspeedKmph),
          condition: current.lang_fr[0].value,
          humidity: parseInt(current.humidity),
          pressure: parseInt(current.pressure),
          icon: current.weatherCode,
        };

        setWeatherData(weather);
        setError(null); // Effacer les erreurs précédentes

        // Sauvegarder les nouvelles données dans localStorage
        try {
          localStorage.setItem("weatherData", JSON.stringify(weather));
        } catch (error) {
          console.error(
            "Erreur lors de la sauvegarde des données météo:",
            error
          );
        }
      } catch (err) {
        console.error("Erreur météo:", err);
        setError("Données météo indisponibles");
        // Les données par défaut restent affichées en cas d'erreur
      }
    };

    fetchWeatherData();
  }, []);

  // Fonction pour obtenir l'icône météo basée sur le code météo
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (
      conditionLower.includes("nuageux") ||
      conditionLower.includes("couvert")
    )
      return "☁️";
    if (
      conditionLower.includes("soleil") ||
      conditionLower.includes("ensoleillé")
    )
      return "☀️";
    if (conditionLower.includes("pluie") || conditionLower.includes("averse"))
      return "🌧️";
    if (conditionLower.includes("orage")) return "⛈️";
    if (conditionLower.includes("brouillard")) return "🌫️";
    return "🌤️";
  };

  // Afficher l'erreur seulement si on n'a pas de données du tout
  if (error && !weatherData) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  // Si on n'a pas encore de données, afficher un message discret (seulement au premier chargement)
  if (!weatherData) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span>Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-start gap-3 text-sm text-white">
      <div className="flex items-center space-x-1 px-2 py-1">
        <span className="text-lg">{getWeatherIcon(weatherData.condition)}</span>
        <span className="font-medium">{weatherData.temperature}°C</span>
      </div>

      <div className="flex items-center space-x-1 px-2 py-1">
        <span className="text-lg">💨</span>
        <span className="font-medium">{weatherData.windSpeed} km/h</span>
      </div>
    </div>
  );
};

export default WeatherInfo;
