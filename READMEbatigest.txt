BATIGEST PRO 2.0 — INSTALLATION

CONTENU
- index.html : application web locale, sans dépendance externe.
- api/ : API PHP avec sessions, mots de passe hachés, rôles et journal d'audit.
- database/schema.sql : structure MySQL.
- api/config.php : paramètres de connexion MySQL.
- api/setup_admin.php : création du compte administrateur initial (à supprimer après usage).

DÉMARRAGE EN MODE LOCAL
1. Décompresser le ZIP.
2. Ouvrir index.html dans Edge, Chrome ou Firefox.
3. Les données de démonstration sont enregistrées dans localStorage du navigateur.
4. Exporter régulièrement une sauvegarde JSON depuis Paramètres.

FONCTIONS DE CETTE VERSION
- Plusieurs bâtiments, étages et locaux/pièces.
- Installations associées à un bâtiment, un étage, une pièce, un technicien et une entreprise.
- Éditeur de plan schématique SVG : symboles électriques, réseau, sécurité et plomberie ; tracés de conduites/câbles.
- Projets, équipe, entreprises, stock, devis, factures et fiches de réception.
- Rapports, CSV, sauvegarde/restauration JSON et impression des documents.

ACTIVER LE MODE MULTI-UTILISATEURS (WAMP)
1. Copier le dossier BatiGest_Pro dans C:\wamp64\www\
2. Démarrer Apache et MySQL depuis WampServer.
3. Ouvrir phpMyAdmin et importer database/schema.sql.
4. Modifier api/config.php (DB_HOST, DB_NAME, DB_USER, DB_PASS).
5. Ouvrir http://localhost/BatiGest_Pro/api/setup_admin.php une seule fois.
6. Se connecter avec admin / ChangeMe-2026!, puis changer ce mot de passe.
7. SUPPRIMER api/setup_admin.php après création du compte.
8. Vérifier http://localhost/BatiGest_Pro/api/health (selon la configuration Apache, une règle de réécriture peut être nécessaire).

ACCÈS DEPUIS LES AUTRES ORDINATEURS
- Le PC serveur et les clients doivent être sur le même réseau local.
- Utiliser l'adresse IP LAN du PC serveur, par exemple http://192.168.1.50/BatiGest_Pro/
- Autoriser Apache dans le pare-feu Windows sur le réseau privé.
- Ne pas exposer directement WAMP/phpMyAdmin sur Internet.
- Pour un accès Internet distant, déployer sur un hébergement HTTPS sécurisé ou mettre en place un VPN.

IMPORTANT — ÉTAT D'INTÉGRATION
La version HTML fournie est le prototype front-end local complet. L'API PHP/MySQL constitue le socle serveur : l'interface actuelle n'est pas encore reliée automatiquement à ces routes. Il faut réaliser la couche de synchronisation API (connexion, chargement, création/modification/suppression) avant de considérer le mode multi-postes comme opérationnel.
Les comptes de démonstration visibles dans l'interface ne sont pas de vrais comptes de connexion. Les comptes réels sont ceux créés dans MySQL.
Le plan est un éditeur schématique de repérage, pas un logiciel CAO certifié. Il ne remplace pas les plans d'exécution, calculs de dimensionnement ou validation par un professionnel habilité.
Les modèles de devis/factures sont des bases à compléter avec vos mentions légales, taxes, numérotation et conditions commerciales.
