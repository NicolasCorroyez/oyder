# Modèle de données (Firestore)

## Collections

### sellers (vendeurs)

- id (doc id, string)
- displayName: string
- pinHash: string (SHA-256 du code numérique) — **jamais stocker le PIN en clair**
- isActive: bool (par défaut true)
- createdAt: Timestamp

### orders (commandes)

- id (doc id, string)
- clientName: string
- clientPhone: string? (optionnel)
- oysterType: enum['n3','n4','n2','n1','speciales'] // clés stables
- origin: enum['standard','arguain']
- pickupDate: Date (YYYY-MM-DD)
- pickupTime: string (HH:mm)
- location: enum['cabane','marche_piraillan','marche_cabreton']
- creatorId: ref -> sellers/{id}
- status: enum['active','annulee','recue'] (default 'active')
- createdAt: Timestamp
- updatedAt: Timestamp
- notes: string? (optionnel)
- quantity: number? (optionnel) // hypothèse

## Index conseillés

- orders: composite (pickupDate ASC, location ASC, status ASC)
- orders: composite (pickupDate DESC, creatorId ASC)
- orders: single (status)
- sellers: single (isActive)

## Enum mapping (côté app)

oysterTypeLabels = {
'n3':'Numéro 3','n4':'Numéro 4','n2':'Numéro 2','n1':'Numéro 1','speciales':'Spéciales'
}
originLabels = {'standard':'Standard','arguain':'Arguin'}
locationLabels = {
'cabane':'Cabane',
'marche_piraillan':'Marché Piraillan',
'marche_cabreton':'Marché Cabreton'
}
statusLabels = {'active':'Active','annulee':'Annulée','recue':'Récupérée'}
