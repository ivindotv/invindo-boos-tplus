# Générateur de flyers pro (Photoshop)

Ce mini-projet permet de générer rapidement un flyer professionnel dans Photoshop à partir d'un fichier JSON.

## Fichiers

- `generateur_flyer_pro.jsx` : script ExtendScript à exécuter dans Photoshop.
- `examples/flyer.sample.json` : exemple de configuration prêt à adapter.

## Prérequis

- Adobe Photoshop (version prenant en charge ExtendScript).
- Une ou plusieurs polices installées (à ajuster dans le JSON).

## Utilisation

1. Ouvrez Photoshop.
2. Allez dans **Fichier > Scripts > Parcourir...**
3. Sélectionnez `generateur_flyer_pro.jsx`.
4. Quand la boîte de dialogue s'ouvre, sélectionnez votre JSON (par exemple `examples/flyer.sample.json`).
5. Le flyer est généré automatiquement dans un nouveau document.

## Personnalisation rapide

Dans le JSON vous pouvez changer :

- **Format** (`widthMm`, `heightMm`, `dpi`)
- **Couleurs** (fond, titre, sous-titre, footer)
- **Polices et tailles**
- **Contenus texte**
- **Image principale** (`mainImagePath`)

## Conseils pro

- Gardez des marges de sécurité (`marginMm`) pour l'impression.
- Exportez en PDF/X ou TIFF selon l'imprimeur.
- Créez plusieurs JSON pour générer plusieurs variantes de campagnes très vite.
