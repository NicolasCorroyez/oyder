# 🦪 Oyder - Gestion des commandes d'huîtres

Application mobile React pour la gestion des commandes d'huîtres d'un ostréiculteur.

## 🎯 Objectif

- **Saisie rapide** des commandes par les vendeurs
- **Visualisation** par calendrier, par lieu, par créateur
- **Gestion des statuts** (active, annulée, récupérée)
- **Multi-appareils** avec synchronisation temps réel
- **Authentification simple** par code PIN numérique

## 🚀 Fonctionnalités

### ✅ Authentification

- Écran de connexion avec PIN vendeur
- Codes de démo : 1234, 5678, 9999
- Session persistante

### ✅ Dashboard principal

- Vue d'ensemble des commandes
- Statistiques (actives, récupérées)
- Commandes du jour

### ✅ Calendrier

- Vue mensuelle interactive
- Badges indiquant le nombre de commandes par jour
- Sélection de date pour voir les détails

### ✅ Filtres et vues

- **Par lieu** : Cabane, Marché Piraillan, Marché Cabreton
- **Par créateur** : Commandes du vendeur connecté
- **Toutes** : Vue complète avec filtres

### ✅ Gestion des commandes

- Création de nouvelles commandes
- Édition des commandes existantes
- Changement de statut
- Formulaire complet avec tous les champs

## 🛠️ Technologies

- **React 18** avec hooks
- **Vite** pour le build ultra-rapide
- **Tailwind CSS** pour le styling
- **DaisyUI** pour les composants
- **Design mobile-first** responsive

## 📱 Interface mobile

- **Navigation par onglets** intuitifs
- **Formulaire modal** pour les commandes
- **Cartes de commande** avec actions rapides
- **Bouton flottant** pour créer des commandes
- **Filtres** faciles d'utilisation

## 🦪 Types d'huîtres supportés

- Numéro 3, 4, 2, 1
- Spéciales
- Origines : Standard, Arguin

## 📍 Lieux de retrait

- Cabane
- Marché Piraillan
- Marché Cabreton

## 🔄 Statuts des commandes

- **Active** : Commande en cours
- **Annulée** : Commande annulée
- **Récupérée** : Commande livrée

## 🚀 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Ouvrir http://localhost:5173
```

## 🧪 Test de l'application

1. **Ouvrir** l'application dans le navigateur
2. **Se connecter** avec un des codes de démo :
   - 1234 → Jean Dupont
   - 5678 → Marie Martin
   - 9999 → Pierre Durand
3. **Explorer** les différentes vues
4. **Créer** une nouvelle commande avec le bouton +
5. **Tester** les filtres et la navigation

## 📚 Documentation technique

Consultez le dossier `docs/` pour la documentation complète :

- `FEATURES.md` - Fonctionnalités détaillées
- `DATA_MODEL.md` - Modèle de données
- `UI.md` - Interface utilisateur
- `AUTH.md` - Système d'authentification

## 🎨 Personnalisation

- **Thèmes** : DaisyUI propose de nombreux thèmes
- **Couleurs** : Modifiez `tailwind.config.js`
- **Composants** : Utilisez la bibliothèque DaisyUI

## 📱 Responsive Design

L'application s'adapte automatiquement :

- **Mobile** : Interface optimisée tactile
- **Tablet** : Grilles adaptées
- **Desktop** : Navigation complète

---

**Développé avec ❤️ pour la gestion des commandes d'huîtres** 🦪
