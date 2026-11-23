```

### Exemple de structure à utiliser

Pour que les images locales soient correctement récupérées, tu peux organiser ton dossier comme ceci :

```text
Convertisseur_MD_DOCX/
│
├── index.html
│
├── rapport.md
│
└── images/
    ├── moteur.jpg
    ├── schema.png
    └── installation.jpg
```

Dans `rapport.md` :

```markdown
# Rapport technique

## Présentation

Voici une photographie de l'installation :

![Installation](images/installation.jpg)

## Schéma

![Schéma électrique](images/schema.png)

## Moteur

![Moteur](images/moteur.jpg)

Le moteur présenté ci-dessus est un moteur triphasé.
```

Lors de la sélection, sélectionne :

```text
rapport.md
installation.jpg
schema.png
moteur.jpg
```

Le convertisseur cherchera les images par leur nom et les **insérera réellement dans le fichier `.docx`**.

### Point important

Pour une image comme :

```markdown
![Moteur](images/moteur.jpg)
```

le programme cherche d'abord :

```text
images/moteur.jpg
```

puis, si nécessaire :

```text
moteur.jpg
```

Cela permet de fonctionner même si le navigateur ne donne pas au JavaScript l'arborescence complète du dossier.

Cette version constitue donc la **version 2 du convertisseur**, avec l'intégration réelle des images. La prochaine évolution logique serait d'ajouter **les hyperliens Word cliquables et les en-têtes/pieds de page avec numéros de pages**, pour obtenir un convertisseur beaucoup plus proche d'un véritable Markdown → Word professionnel.