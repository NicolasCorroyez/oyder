import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Configuration Firebase (utilisez la même que votre app)
const firebaseConfig = {
  apiKey: "AIzaSyDaleZjacIUhLov-weuKHPOux8w4-gnhRw",
  authDomain: "oyder-7d3f7.firebaseapp.com",
  projectId: "oyder-7d3f7",
  storageBucket: "oyder-7d3f7.firebasestorage.app",
  messagingSenderId: "794604169001",
  appId: "1:794604169001:web:69304f28f1a1866458f938",
  measurementId: "G-20SC9GRDF3",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function readSellers() {
  try {
    console.log("🔍 Lecture des vendeurs depuis Firebase...\n");

    const sellersSnapshot = await getDocs(collection(db, "sellers"));

    if (sellersSnapshot.empty) {
      console.log("❌ Aucun vendeur trouvé dans la collection 'sellers'");
      return;
    }

    console.log(`✅ ${sellersSnapshot.size} vendeur(s) trouvé(s) :\n`);

    sellersSnapshot.forEach((doc) => {
      const seller = doc.data();
      console.log(`📋 Vendeur ID: ${doc.id}`);
      console.log(`   Nom: ${seller.displayName || "Non défini"}`);
      console.log(`   PIN Hash actuel: ${seller.pinHash || "Non défini"}`);
      console.log(`   Actif: ${seller.isActive || false}`);
      console.log(`   Type: ${seller.type || "Non défini"}`);
      console.log("");
    });

    console.log(
      "💡 Note: Les PINs ne sont pas stockés en clair pour des raisons de sécurité."
    );
    console.log(
      "   Vous devez connaître vos PINs pour générer les nouveaux hashes."
    );
  } catch (error) {
    console.error("❌ Erreur lors de la lecture des vendeurs:", error);
  }
}

// Exécuter le script
readSellers();
