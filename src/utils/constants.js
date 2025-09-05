// Labels pour les types d'huîtres
export const oysterTypeLabels = {
  n3: "Numéro 3",
  n4: "Numéro 4",
  n2: "Numéro 2",
  n1: "Numéro 1",
  speciales: "Spéciales",
};

// Labels pour les origines
export const originLabels = {
  standard: "Canelon",
  arguain: "Arguin",
};

// Labels pour les lieux de retrait
export const locationLabels = {
  cabane: "Cabane",
  marche_piraillan: "Marché Piraillan",
  marche_cabreton: "Marché Cabreton",
};

// Labels pour les statuts
export const statusLabels = {
  active: "Active",
  annulee: "Annulée",
  recue: "Livrée",
};

// Correspondances douzaines par panier selon le type d'huîtres
export const basketsPerDozen = {
  n1: 1, // Numéro 1 : 1 panier = 1 douzaine
  n2: 2, // Numéro 2 : 1 panier = 2 douzaines
  n3: 3, // Numéro 3 : 1 panier = 3 douzaines
  n4: 4, // Numéro 4 : 1 panier = 4 douzaines
  speciales: 1, // Spéciales : 1 panier = 1 douzaine (par défaut)
};

// Fonction pour calculer le nombre de paniers selon le type d'huîtres
export const calculateBaskets = (oysterType, quantity) => {
  if (!quantity || quantity <= 0) return 0;

  const multiplier = basketsPerDozen[oysterType] || 1;
  return Math.ceil(quantity / multiplier);
};

// Fonction pour calculer le résumé des paniers par type pour une liste de commandes
export const calculateBasketsSummary = (orders) => {
  const summary = {};

  orders.forEach((order) => {
    if (order.status === "active" && order.quantity && order.quantity > 0) {
      const baskets = calculateBaskets(order.oysterType, order.quantity);
      if (!summary[order.oysterType]) {
        summary[order.oysterType] = {
          type: order.oysterType,
          baskets: 0,
          orders: 0,
        };
      }
      summary[order.oysterType].baskets += baskets;
      summary[order.oysterType].orders += 1;
    }
  });

  return Object.values(summary).sort((a, b) => a.type.localeCompare(b.type));
};
