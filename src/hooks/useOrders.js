import { useState, useCallback } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Créer une nouvelle commande
  const createOrder = async (orderData) => {
    try {
      console.log("🔄 Création commande avec données:", orderData); // Debug

      const newOrder = {
        ...orderData,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("📝 Commande à créer:", newOrder); // Debug

      const docRef = await addDoc(collection(db, "orders"), newOrder);
      console.log("✅ Commande créée avec ID:", docRef.id); // Debug

      return { id: docRef.id, ...newOrder };
    } catch (error) {
      console.error("❌ Erreur création commande:", error);
      throw error;
    }
  };

  // Mettre à jour une commande
  const updateOrder = async (orderId, updates) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur mise à jour commande:", error);
      throw error;
    }
  };

  // Changer le statut d'une commande
  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
    } catch (error) {
      console.error("Erreur changement statut:", error);
      throw error;
    }
  };

  // Supprimer une commande
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.error("Erreur suppression commande:", error);
      throw error;
    }
  };

  // Charger les commandes avec filtres - STABILISÉ avec useCallback
  const loadOrders = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);

        let q = collection(db, "orders");
        const constraints = [];

        // Filtres
        if (filters.status) {
          constraints.push(where("status", "==", filters.status));
        }

        if (filters.creatorId) {
          constraints.push(where("creatorId", "==", filters.creatorId));
        }

        if (filters.location) {
          constraints.push(where("location", "==", filters.location));
        }

        if (filters.pickupDate) {
          constraints.push(where("pickupDate", "==", filters.pickupDate));
        }

        // Tri par date de retrait
        constraints.push(orderBy("pickupDate", "asc"));
        constraints.push(orderBy("pickupTime", "asc"));

        q = query(q, ...constraints);

        // Écoute en temps réel
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log("📥 Snapshot reçu:", snapshot.size, "documents"); // Debug
            console.log("📋 Commandes récupérées:", ordersData); // Debug

            setOrders(ordersData);

            console.log("📊 Après setOrders - ordersData défini:", ordersData); // Debug

            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error("❌ Erreur écoute commandes:", error);
            setError(error.message);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Erreur chargement commandes:", error);
        setError(error.message);
        setLoading(false);
      }
    },
    [] // Dépendances vides pour éviter la boucle infinie
  );

  // Charger les commandes pour une période donnée - STABILISÉ avec useCallback
  const loadOrdersForPeriod = useCallback(
    async (startDate, endDate, filters = {}) => {
      try {
        setLoading(true);

        let q = collection(db, "orders");
        const constraints = [
          where("pickupDate", ">=", startDate),
          where("pickupDate", "<=", endDate),
        ];

        // Ajouter les autres filtres
        if (filters.status) {
          constraints.push(where("status", "==", filters.status));
        }

        if (filters.creatorId) {
          constraints.push(where("creatorId", "==", filters.creatorId));
        }

        if (filters.location) {
          constraints.push(where("location", "==", filters.location));
        }

        constraints.push(orderBy("pickupDate", "asc"));
        constraints.push(orderBy("pickupTime", "asc"));

        q = query(q, ...constraints);

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const ordersData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setOrders(ordersData);
            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error("Erreur écoute commandes période:", error);
            setError(error.message);
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Erreur chargement commandes période:", error);
        setError(error.message);
        setLoading(false);
      }
    },
    []
  ); // Dépendances vides

  // Grouper les commandes par date pour le calendrier
  const getOrdersByDate = useCallback(() => {
    const grouped = {};

    orders.forEach((order) => {
      const date = order.pickupDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(order);
    });

    return grouped;
  }, [orders]);

  // Statistiques des commandes
  const getOrderStats = useCallback(() => {
    const stats = {
      total: orders.length,
      active: orders.filter((o) => o.status === "active").length,
      cancelled: orders.filter((o) => o.status === "annulee").length,
      completed: orders.filter((o) => o.status === "recue").length,
      byLocation: {},
      byType: {},
    };

    orders.forEach((order) => {
      // Par lieu
      if (!stats.byLocation[order.location]) {
        stats.byLocation[order.location] = 0;
      }
      stats.byLocation[order.location]++;

      // Par type d'huîtres
      if (!stats.byType[order.oysterType]) {
        stats.byType[order.oysterType] = 0;
      }
      stats.byType[order.oysterType]++;
    });

    return stats;
  }, [orders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    changeOrderStatus,
    deleteOrder,
    loadOrders,
    loadOrdersForPeriod,
    getOrdersByDate,
    getOrderStats,
  };
};
