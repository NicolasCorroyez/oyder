# Règles de validation (côté app)

- Nom client: non vide, trim.
- Téléphone: optionnel, format FR/E.164 si saisi.
- Date retrait: >= aujourd’hui (autoriser rétro si besoin interne ? par défaut oui).
- Heure retrait: obligatoire.
- Type, Origine, Lieu: valeurs limitées (enum).
- Statut: par défaut `active`.
- Quantité: entier > 0 (si saisi).
