# Notes d’implémentation

## Login PIN

- Input numérique (obscurcir les digits).
- `onSubmit`:
  1. `FirebaseAuth.instance.signInAnonymously()` si pas déjà signé.
  2. `hash = sha256(pin)`, query sellers `where pinHash == hash and isActive==true limit 1`.
  3. Si trouvé: persister `sellerId, displayName` localement. Naviguer vers `/`.
  4. Sinon: afficher "Code invalide".

## Création commande

- Construire l'objet selon `DATA_MODEL.md`.
- Normaliser date/heure (ex: stocker date ISO `YYYY-MM-DD` + `HH:mm`).
- `createdAt/updatedAt` = `FieldValue.serverTimestamp()`.

## Calendrier

- Charger commandes dans la plage [startOfMonth-1w, endOfMonth+1w].
- Grouper par `pickupDate`.
- Indicateurs par jour: total + répartition lieux (petits badges).

## Filtres listes

- Firestore: requêtes par `pickupDate` + `location` + `creatorId` + `status`.
- Prévoir index composite (voir `DATA_MODEL.md`).

## Statuts

- `annuler`: `status='annulee'`.
- `récupérée`: `status='recue'`.
- Réafficher chips selon statut.

## Suppression

- Soft delete non requis → delete doc. (Option: passer `status='annulee'` au lieu de delete.)
