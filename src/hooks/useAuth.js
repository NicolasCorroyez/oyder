import { useState, useEffect } from "react";
import {
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  // Connexion anonyme Firebase
  const signInAnonymously = async () => {
    try {
      const result = await firebaseSignInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error("Erreur connexion anonyme:", error);
      throw error;
    }
  };

  // Vérifier le PIN du vendeur
  const verifySellerPin = async (pin) => {
    try {
      console.log("🔐 Vérification PIN:", pin); // Debug

      // Hash du PIN
      const pinHash = await hashPin(pin);
      console.log("🔐 Hash calculé:", pinHash); // Debug

      // Rechercher le vendeur
      const q = query(
        collection(db, "sellers"),
        where("pinHash", "==", pinHash),
        where("isActive", "==", true)
      );

      console.log("🔐 Requête Firestore créée"); // Debug
      const snapshot = await getDocs(q);
      console.log("🔐 Snapshot reçu:", snapshot.size, "documents"); // Debug

      if (!snapshot.empty) {
        const sellerDoc = snapshot.docs[0];
        const sellerData = {
          id: sellerDoc.id,
          ...sellerDoc.data(),
        };

        console.log("🔐 Vendeur trouvé:", sellerData); // Debug

        // Stocker localement
        localStorage.setItem("currentSellerId", sellerData.id);
        localStorage.setItem("currentSellerName", sellerData.displayName);

        setSeller(sellerData);
        return sellerData;
      } else {
        console.log("🔐 Aucun vendeur trouvé avec ce hash"); // Debug
        throw new Error("Code vendeur invalide ou vendeur inactif");
      }
    } catch (error) {
      console.error("Erreur vérification PIN:", error);
      throw error;
    }
  };

  // Hash SHA-256 du PIN - avec fallback pour les environnements non sécurisés
  const hashPin = async (pin) => {
    try {
      // Essayer d'abord l'API Web Crypto (HTTPS)
      if (crypto && crypto.subtle && crypto.subtle.digest) {
        const encoder = new TextEncoder();
        const data = encoder.encode(pin);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (error) {
      console.warn(
        "Web Crypto non disponible, utilisation du fallback:",
        error
      );
    }

    // Fallback : fonction de hash simple (pour développement/test)
    // ⚠️ ATTENTION : Ce n'est pas cryptographiquement sécurisé
    // En production, utilisez toujours HTTPS pour avoir accès à crypto.subtle
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

  // Déconnexion
  const signOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("currentSellerId");
      localStorage.removeItem("currentSellerName");
      setSeller(null);
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 onAuthStateChanged - user:", user); // Debug

      if (user) {
        // Utilisateur connecté, charger le vendeur
        const sellerId = localStorage.getItem("currentSellerId");
        const sellerName = localStorage.getItem("currentSellerName");

        if (sellerId && sellerName) {
          const sellerData = { id: sellerId, displayName: sellerName };
          console.log("🔐 Chargement vendeur depuis localStorage:", sellerData); // Debug
          setSeller(sellerData);
        } else {
          console.log("🔐 Aucun vendeur trouvé dans localStorage"); // Debug
          setSeller(null);
        }
      } else {
        // Utilisateur déconnecté
        console.log("🔐 Utilisateur déconnecté"); // Debug
        setSeller(null);
      }

      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Calculer isAuthenticated de manière stable
  const isAuthenticated = !loading && !!user && !!seller;

  console.log("🔐 useAuth - État actuel:", {
    user: !!user,
    seller: !!seller,
    loading,
    isAuthenticated,
  }); // Debug

  return {
    user,
    seller,
    loading,
    signInAnonymously,
    verifySellerPin,
    signOut,
    isAuthenticated,
  };
};
