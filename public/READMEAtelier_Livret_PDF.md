# Atelier PDF — Créateur de livrets

Application web locale en HTML, CSS et JavaScript pour préparer un PDF avant impression en livret.

## Lancement
1. Décompressez le dossier.
2. Ouvrez `index.html` avec Chrome, Edge ou Firefox.
3. Une connexion Internet est nécessaire au premier chargement pour récupérer PDF-Lib et PDF.js depuis CDN.
4. Importez un PDF puis utilisez les vignettes et les paramètres.
5. Cliquez sur **Créer le PDF livret**.

Vous pouvez aussi lancer un petit serveur local depuis le dossier :
```bash
python -m http.server 8080
```
Puis ouvrez `http://localhost:8080`.

## Fonctions
- Import PDF par sélection ou glisser-déposer.
- Aperçu des pages sous forme de vignettes.
- Sélection multiple, réorganisation par glisser-déposer.
- Rotation ±90°, duplication et suppression.
- Imposition en livret, avec pages blanches ajoutées automatiquement pour compléter les groupes de quatre.
- Formats de feuille A4, A3 et Letter.
- Marges, gouttière, repère de pliure et repères de coupe.
- Adaptation des pages au cadre et export PDF.

## Limites à connaître
- Les modifications concernent les pages (ordre, rotation, duplication, suppression), pas l'édition du texte déjà imprimé dans le PDF.
- Le mode « Rectos uniquement » sert au contrôle de l'ordre et ne constitue pas un livret recto-verso complet.
- L'application utilise PDF-Lib et PDF.js via CDN : les bibliothèques sont téléchargées depuis Internet, mais le contenu du PDF est traité dans le navigateur.
- Les PDF chiffrés/protégés et certains formulaires ou contenus PDF complexes peuvent ne pas être pris en charge.
- Pour imprimer, utilisez généralement le recto-verso avec retournement sur le bord court pour les feuilles paysage, mais faites un essai : le comportement dépend du pilote d'impression.
