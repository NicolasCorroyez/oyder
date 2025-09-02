// Utilitaires pour le hashage des PINs
// ⚠️ ATTENTION : Ces fonctions ne sont pas cryptographiquement sécurisées
// Elles sont uniquement pour le développement et les tests

// Fonction de hash simple (fallback)
export const simpleHash = (pin) => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convertir en hexadécimal
  const hashHex = Math.abs(hash).toString(16);
  return hashHex.padStart(8, "0");
};

// Calculer les hashes des PINs de test
export const getTestPinHashes = () => {
  return {
    1234: simpleHash("1234"),
    5678: simpleHash("5678"),
    9999: simpleHash("9999"),
  };
};

// Afficher les hashes dans la console pour le développement
if (typeof window !== "undefined") {
  console.log("🔐 Hashes des PINs de test:", getTestPinHashes());
}
