import crypto from "crypto";

// PINs des vendeurs (basés sur vos hashes actuels)
const sellerPINs = [
  "1234", // Bob - hash actuel: 0018e942
  "5678", // Alice - hash actuel: 00170842
  "9999", // Charlie - hash actuel: 001ac640
];

// Fonction pour générer le hash SHA-256
function generateSHA256Hash(pin) {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

console.log("🔐 Génération des hashes SHA-256 pour les PINs vendeurs\n");

sellerPINs.forEach((pin, index) => {
  const hash = generateSHA256Hash(pin);
  const names = ["Bob", "Alice", "Charlie"];
  console.log(`Vendeur ${index + 1} (${names[index]}):`);
  console.log(`  PIN: ${pin}`);
  console.log(`  Hash SHA-256: ${hash}`);
  console.log("");
});

console.log("📋 Instructions pour Firebase :");
console.log("1. Allez dans Firebase Console > Firestore");
console.log("2. Collection 'sellers'");
console.log("3. Mettez à jour le champ 'pinHash' avec les nouveaux hashes");
console.log("4. Sauvegardez chaque document");
console.log("\n⚠️  ATTENTION : Assurez-vous d'avoir sauvegardé vos PINs !");
