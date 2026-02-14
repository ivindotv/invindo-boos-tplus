# Création du vrai fichier `.atn` dans Photoshop

Le format `.atn` est binaire/propriétaire. Le fichier `Flyer_Pro_Generator.atn` livré ici sert de placeholder dans le repo.

## Étapes pour produire le vrai `.atn`

1. Ouvrir Photoshop.
2. Aller dans **Fenêtre > Actions**.
3. Créer un nouvel ensemble (ex: `Invindo`).
4. Créer une nouvelle action (ex: `Flyer Pro Generator`) puis cliquer sur **Enregistrer**.
5. Exécuter une fois:
   - **Fichier > Scripts > Parcourir...**
   - choisir `generateur_flyer_pro.jsx`
   - choisir votre JSON (ex: `examples/flyer.sample.json`)
6. Arrêter l'enregistrement de l'action.
7. Dans le panneau Actions: menu ☰ > **Enregistrer les actions...**
8. Exporter le fichier sous `Flyer_Pro_Generator.atn` (ce fichier binaire remplacera le placeholder).

## Recommandation

- Conserver l'action minimale (appel du script + sélection JSON) pour qu'elle reste stable.
- Versionner aussi le JSON pour obtenir des variantes de flyers reproductibles.
