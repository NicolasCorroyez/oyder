# Plan de tests

## Unitaires

- Validation des champs.
- Mappers enum <-> labels.
- Hash PIN.

## Intégration

- Login avec PIN valide/invalide.
- Création/édition/suppression commandes.
- Changement de statut (annuler/récupérer).
- Filtres listes (date, lieu, créateur, statut).
- Calendrier: agrégation par jour.

## E2E

- Deux appareils connectés: création sur A visible sur B en temps réel.
- Conflits d’édition: dernière écriture gagne (Firestore timestamp).
- Hors-ligne: création en file d’attente puis synchro.
