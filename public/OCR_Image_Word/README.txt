OCR IMAGE → WORD
================

Cette version utilise Tesseract.js en local pour faire une vraie reconnaissance OCR.
Aucune API OCR distante n'est utilisée pendant la reconnaissance.

ARBORESCENCE
------------
OCR-Image-Word/
│
├── index.html
├── installer-ocr.ps1
├── lancer.bat
├── README.txt
└── ocr/
    ├── tesseract.min.js
    ├── worker.min.js
    ├── core/
    │   ├── tesseract-core.wasm.js
    │   ├── tesseract-core-simd.wasm.js
    │   ├── tesseract-core-lstm.wasm.js
    │   └── tesseract-core-simd-lstm.wasm.js
    └── lang/
        └── fra.traineddata.gz

INSTALLATION
------------
1. Ouvre PowerShell dans ce dossier.
2. Exécute :

   Set-ExecutionPolicy -Scope Process Bypass
   .\installer-ocr.ps1

3. Le script télécharge les fichiers OCR nécessaires.
4. Ensuite double-clique sur lancer.bat.

IMPORTANT
---------
Le moteur OCR utilise des Web Workers et WebAssembly.
Il est donc préférable de lancer la page avec un petit serveur HTTP local
plutôt que de l'ouvrir directement avec file://.

Aucun PHP n'est nécessaire.

Le bouton "Créer le document Word" génère le DOCX directement dans le navigateur.

AMELIORER LA RECONNAISSANCE
---------------------------
- utiliser une image nette ;
- éviter les photos inclinées ;
- augmenter la résolution ;
- utiliser un fond clair et un texte sombre ;
- recadrer l'image autour du texte ;
- sélectionner Français ou Français + anglais.

LANGUES
-------
La configuration fournie télécharge le français.
Le code prévoit aussi anglais et français+anglais, mais pour ces deux options
il faut également télécharger eng.traineddata.gz et, pour fra+eng, conserver les deux fichiers.

Les fichiers Tesseract.js sont distribués sous leurs licences respectives.
Consulter les fichiers LICENSE des projets Tesseract.js/Tesseract.js-core
si tu redistribues le projet.
