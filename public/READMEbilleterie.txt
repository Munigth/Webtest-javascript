BILLET PRO — PROTOTYPE LOCAL

Ouvrir index.html dans un navigateur. Pour tester la caméra, mieux vaut servir le dossier en local :
  python -m http.server 8000
Puis ouvrir http://localhost:8000 et autoriser la caméra.

Le QR et le scanner utilisent des bibliothèques chargées par CDN : connexion Internet requise.
Le stockage est local au navigateur. Les appareils ne se synchronisent pas, et ce prototype n'est pas sécurisé contre la fraude. Le scan de code-barres linéaire n'est pas activé; le prototype lit les QR.

Avant une mise en production : API et base de données, authentification organisateur/agents, contrôle de billets atomique côté serveur, journal central, gestion paiements/remboursements, sauvegardes, protection des données et tests de charge.
