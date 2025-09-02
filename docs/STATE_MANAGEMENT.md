# State management (Riverpod)

Providers principaux:

- `authProvider` : état de session anonyme + seller courant (id, displayName).
- `sellersRepository` : accès collection sellers.
- `ordersRepository` : accès collection orders (streams Firestore).
- `filtersProvider` : filtres actifs (date range, lieu, créateur, statut).
- `calendarProvider` : regroupe commandes par date.
- `orderFormProvider` : état du formulaire.

Flux:

- Création/modification → validations synchrones → write Firestore → `updatedAt`.
- Changement de statut (annulée / récupérée) → simple patch Firestore.

Erreurs:

- Exposer `AsyncValue` (loading/error) aux écrans.
