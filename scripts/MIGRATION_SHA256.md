# 🔐 Migration vers SHA-256 - Instructions

## 🎯 **Objectif**

Migrer les hashes des PINs vendeurs de `simpleHash` vers `SHA-256` pour la compatibilité avec Vercel (HTTPS).

## ⚠️ **IMPORTANT : Sauvegardez vos PINs !**

- **Notez tous vos PINs vendeurs** avant de commencer
- **Ne les perdez pas** - ils ne sont pas stockés en clair dans Firebase

## 📋 **Étapes de migration**

### **1. Lire les vendeurs existants**

```bash
cd scripts
node readSellers.js
```

### **2. Générer les nouveaux hashes SHA-256**

```bash
# Modifiez le fichier generateSHA256Hashes.js avec vos vrais PINs
node generateSHA256Hashes.js
```

### **3. Mettre à jour Firebase**

1. **Firebase Console** → **Firestore Database**
2. **Collection `sellers`**
3. **Pour chaque vendeur :**
   - Cliquez sur le document
   - Modifiez le champ `pinHash`
   - Remplacez par le nouveau hash SHA-256
   - Sauvegardez

### **4. Tester localement**

```bash
# Démarrer en HTTPS local
npm run dev -- --https
```

## 🔍 **Vérification**

### **✅ Avant migration :**

- PINs fonctionnent en local (HTTP)
- PINs ne fonctionnent pas sur Vercel (HTTPS)

### **✅ Après migration :**

- PINs fonctionnent partout (local + Vercel)
- Sécurité améliorée avec SHA-256

## 🚨 **En cas de problème**

### **Rollback :**

1. **Firebase Console** → **Firestore**
2. **Restaurer** les anciens `pinHash`
3. **Vérifier** que les PINs fonctionnent à nouveau

### **Support :**

- Vérifiez que les PINs sont corrects
- Vérifiez que les hashes sont bien copiés
- Testez avec un seul vendeur d'abord

## 💡 **Conseils**

- **Testez un vendeur à la fois**
- **Gardez une copie** des anciens hashes
- **Vérifiez** que l'app fonctionne après chaque mise à jour
