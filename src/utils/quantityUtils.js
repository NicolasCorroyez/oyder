/**
 * Utilitaires pour formater les quantités en douzaines
 */

/**
 * Formate une quantité en douzaines avec le bon texte
 * @param {number} quantity - La quantité en douzaines
 * @returns {string} - La quantité formatée (ex: "1 douzaine", "2.5 douzaines")
 */
export const formatQuantity = (quantity) => {
  if (!quantity && quantity !== 0) return "Non spécifiée";

  const num = parseFloat(quantity);
  if (isNaN(num)) return "Non spécifiée";

  if (num === 0.5) return "1/2 douzaine";
  if (num === 1) return "1 douzaine";
  if (num === 1.5) return "1 douzaine et demie";

  // Pour les autres valeurs
  if (Number.isInteger(num)) {
    return `${num} douzaine${num > 1 ? "s" : ""}`;
  } else {
    return `${num} douzaines`;
  }
};

/**
 * Formate une quantité en douzaines de manière courte (pour les espaces restreints)
 * @param {number} quantity - La quantité en douzaines
 * @returns {string} - La quantité formatée courte (ex: "1 dz", "2.5 dz")
 */
export const formatQuantityShort = (quantity) => {
  if (!quantity && quantity !== 0) return "Non spécifiée";

  const num = parseFloat(quantity);
  if (isNaN(num)) return "Non spécifiée";

  return `${num} dz`;
};

/**
 * Valide qu'une quantité est dans les limites acceptables
 * @param {number} quantity - La quantité à valider
 * @returns {boolean} - True si la quantité est valide
 */
export const isValidQuantity = (quantity) => {
  const num = parseFloat(quantity);
  if (isNaN(num)) return false;

  // Minimum 1/2 douzaine, pas de maximum
  return num >= 0.5;
};

/**
 * Obtient le message d'erreur pour une quantité invalide
 * @param {number} quantity - La quantité à valider
 * @returns {string|null} - Le message d'erreur ou null si valide
 */
export const getQuantityErrorMessage = (quantity) => {
  if (isValidQuantity(quantity)) return null;

  const num = parseFloat(quantity);
  if (isNaN(num)) return "La quantité doit être un nombre";
  if (num < 0.5) return "La quantité minimum est de 1/2 douzaine (0.5)";

  return "Quantité invalide";
};
