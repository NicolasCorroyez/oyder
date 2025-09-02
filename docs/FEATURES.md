# Fonctionnalités

## Saisie d’une commande

Champs obligatoires :

- nom_client
- type_huitres (numéro 3, 4, 2, 1, spéciales)
- origine (standard, arguain)
- date_retrait (date)
- heure_retrait (heure)
- lieu_retrait (cabane, marché piraillan, marché cabreton)

Champs optionnels :

- telephone_client
- note_interne (texte libre, optionnel)
- quantité (optionnel) — **hypothèse** utile mais non exigée

Métadonnées :

- createur_id (vendeur connecté)
- status: `active | annulee | recue`

Actions:

- Créer / Modifier / Annuler / Marquer “récupérée” / Supprimer.

## Visualisations

- **Calendrier** (par jour/semaine/mois) avec badges par lieu & statut.
- **Par lieu** : liste des commandes pour un lieu + filtres de dates/statuts.
- **Par créateur** : idem, filtré par vendeur.

## Authentification

- Écran “Entrez votre code vendeur (PIN)” → association au vendeur.
- Auth Firebase **anonyme**, stock local + Firestore (mapping code → vendeur).

## Multi-appareils

- Firestore en temps réel, mêmes données partout.

## Hors-ligne

- Lecture cache Firestore + file d’attente d’écritures (best effort).
