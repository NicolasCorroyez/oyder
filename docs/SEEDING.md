# Seeding de base

## sellers

Créer 2-3 vendeurs avec les nouveaux hashes :

### Vendeur 1

- displayName: "Alice"
- pin: "1234"
- pinHash: "00000001" (hash simple de "1234")
- isActive: true

### Vendeur 2

- displayName: "Bob"
- pin: "5678"
- pinHash: "00000002" (hash simple de "5678")
- isActive: true

### Vendeur 3

- displayName: "Charlie"
- pin: "9999"
- pinHash: "00000003" (hash simple de "9999")
- isActive: true

## ⚠️ Important

**Ces hashes sont calculés avec la fonction de fallback** qui n'est pas cryptographiquement sécurisée.

**En production :**

- Utilisez toujours HTTPS pour avoir accès à `crypto.subtle.digest`
- Les vrais hashes SHA-256 seront automatiquement utilisés
- Ces hashes de test ne fonctionneront plus

**Pour le développement :**

- Ouvrez la console du navigateur
- Vous verrez les hashes calculés : `🔐 Hashes des PINs de test: {...}`
- Utilisez ces hashes dans Firebase
