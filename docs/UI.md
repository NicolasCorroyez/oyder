# UI / UX

## Écrans

1. **Login PIN**

   - Champ PIN (clavier numérique), bouton “Se connecter”.
   - Erreurs: “Code invalide”, “Vendeur inactif”.
   - Persister la session (SharedPreferences / secure_storage).

2. **Dashboard**

   - Onglets: Calendrier | Par lieu | Par créateur | Toutes
   - Bouton flottant “+ Commande”.

3. **Calendrier**

   - Composant: table_calendar
   - Indicateurs: nombre de commandes par jour, badges par lieu.
   - Tap jour → liste du jour (sheet) → tap commande → détail.

4. **Liste (Toutes / Par lieu / Par créateur)**

   - Filtres: Date (jour/semaine/période), Lieu, Créateur, Statut.
   - Tri par date/heure.
   - Items avec : nom client, heure, type, lieu, statut (chip), menu actions.

5. **Détail commande**

   - Affiche tous les champs.
   - Actions: Modifier, Annuler, Marquer récupérée, Supprimer.

6. **Formulaire commande (création/édition)**
   - Champs:
     - Nom client (obligatoire)
     - Téléphone (optionnel)
     - Type huîtres (picker: n3, n4, n2, n1, spéciales)
     - Origine (picker: standard, arguain)
     - Date retrait (date picker)
     - Heure retrait (time picker)
     - Lieu (picker)
     - Quantité (optionnel)
     - Notes (optionnel)
   - Bouton Enregistrer / Mettre à jour.

## Composants UI

- Chips de statut (Active = neutre, Annulée = rouge, Récupérée = vert).
- Badges de lieu dans le calendrier.
- Empty states clairs + CTA.

## Accessibilité

- Tailles de police compatibles, contrastes, labels pour lecteurs d’écran.
