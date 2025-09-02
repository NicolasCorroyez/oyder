# Guide de configuration - Oyder

## 🚀 Configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Nommez votre projet (ex: "oyder-app")
4. Activez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

### 2. Activer les services

#### Authentication

1. Dans le menu gauche, cliquez sur "Authentication"
2. Cliquez sur "Commencer"
3. Dans l'onglet "Sign-in method", activez "Anonyme"
4. Cliquez sur "Enregistrer"

#### Firestore Database

1. Dans le menu gauche, cliquez sur "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Mode production" ou "Mode test" (vous pourrez changer plus tard)
4. Choisissez l'emplacement de votre base de données (ex: europe-west3)
5. Cliquez sur "Terminé"

### 3. Récupérer la configuration

1. Cliquez sur l'icône ⚙️ (Paramètres) à côté de "Vue d'ensemble du projet"
2. Sélectionnez "Paramètres du projet"
3. Dans l'onglet "Général", faites défiler jusqu'à "Vos applications"
4. Cliquez sur l'icône web (</>) pour ajouter une application web
5. Nommez votre application (ex: "oyder-web")
6. Cliquez sur "Enregistrer l'app"
7. Copiez la configuration Firebase

### 4. Configurer l'application

1. Copiez le fichier `src/config/firebase.example.js` vers `src/config/firebase.js`
2. Remplacez les valeurs par vos vraies clés Firebase :

```javascript
const firebaseConfig = {
  apiKey: "votre-vraie-api-key",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-vrai-project-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "votre-vrai-sender-id",
  appId: "votre-vrai-app-id",
};
```

## 🔐 Configuration des règles Firestore

### 1. Règles de sécurité

Dans Firebase Console > Firestore Database > Règles, remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vendeurs : lecture publique, écriture admin uniquement
    match /sellers/{sellerId} {
      allow read: if true;
      allow write: if false; // Seul l'admin peut créer/modifier
    }

    // Commandes : lecture/écriture pour tous les utilisateurs authentifiés
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Index composés

Créez ces index dans Firestore Database > Index :

## Collection : orders\*\*

- `pickupDate` (Ascending) + `location` (Ascending) + `status` (Ascending)
- `pickupDate` (Descending) + `creatorId` (Ascending)
- `status` (Ascending)

## 🌱 Seeding des données

### 1. Créer les vendeurs

Dans Firebase Console > Firestore Database, créez des documents dans la collection `sellers` :

```javascript
// Document 1
{
  displayName: "Alice",
  pinHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", // SHA-256 de "1234"
  isActive: true,
  createdAt: Timestamp.now()
}

// Document 2
{
  displayName: "Bob",
  pinHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", // SHA-256 de "5678"
  isActive: true,
  createdAt: Timestamp.now()
}

// Document 3
{
  displayName: "Charlie",
  pinHash: "ef92b778bafe771e89245b6ec92b4d3d2d534c0f50f6e0f1d0d1b2b3c4d5e6f7", // SHA-256 de "9999"
  isActive: true,
  createdAt: Timestamp.now()
}
```

### 2. Calculer le hash SHA-256

Utilisez un outil en ligne ou votre terminal :

```bash
# Sur macOS/Linux
echo -n "1234" | shasum -a 256
```

## 🚀 Lancer l'application

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer en mode développement

```bash
npm run dev
```

### 3. Tester la connexion

1. Ouvrez l'application dans votre navigateur
2. Utilisez un des codes PIN : 1234, 5678, ou 9999
3. Vous devriez être connecté et voir le dashboard

## 🔧 Dépannage

### Erreur "Firebase: Error (auth/operation-not-allowed-in-this-context)"

- Vérifiez que l'authentification anonyme est activée dans Firebase Console

### Erreur "Firebase: Error (firestore/permission-denied)"

- Vérifiez que les règles Firestore sont correctement configurées
- Vérifiez que l'utilisateur est authentifié

### Erreur "Firebase: Error (firestore/unavailable)"

- Vérifiez que Firestore est activé dans votre projet
- Vérifiez que vous avez une connexion internet

## 📱 Déploiement

### 1. Build de production

```bash
npm run build
```

### 2. Déployer sur Vercel

1. Installez Vercel CLI : `npm i -g vercel`
2. Déployez : `vercel --prod`

### 3. Déployer sur Netlify

1. Connectez votre repo GitHub
2. Configurez la commande de build : `npm run build`
3. Configurez le dossier de publication : `dist`

## 🔒 Sécurité

- **Ne jamais** commiter les vraies clés Firebase dans Git
- Utilisez des variables d'environnement en production
- Testez les règles Firestore avant la mise en production
- Surveillez l'utilisation de votre projet Firebase

## 📞 Support

En cas de problème :

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs Firebase Console
3. Consultez la [documentation Firebase](https://firebase.google.com/docs)
