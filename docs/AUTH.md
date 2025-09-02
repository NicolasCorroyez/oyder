# Auth — Code numérique vendeur

## Principe

- L’utilisateur se connecte **anonymement** via Firebase Auth.
- Dans l’écran de login, il saisit son **code numérique** (PIN).
- L’app calcule `sha256(PIN)` et cherche un document `sellers` avec `pinHash` correspondant et `isActive == true`.
- Si trouvé → associer localement `currentSellerId` = seller.id.
- L’app écrit `creatorId = currentSellerId` lors de la création des commandes.

## Sécurité

- Le PIN n’est **jamais** stocké ni envoyé en clair.
- Les règles Firestore n’exposent pas `pinHash` sauf lecture de la collection (OK car c’est un hash). Éviter d’afficher la liste des vendeurs dans l’UI publique.
- Option : limiter l’accès sellers aux seuls champs nécessaires via règles (voir `FIRESTORE_RULES.md`).

## Gestion des vendeurs

- Seed initial via `docs/SEEDING.md`.
- Pour révoquer : `isActive=false` ou changer le `pinHash`.
