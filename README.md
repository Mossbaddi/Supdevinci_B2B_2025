# 🎓 MERN JS Project - Projet Pédagogique

Un projet pédagogique complet pour apprendre la stack MERN (MongoDB, Express, React, Node.js) de manière progressive et structurée.

## 📖 À propos

Ce projet est conçu comme un **parcours d'apprentissage complet** qui guide les apprenants à travers le développement d'une application web moderne en utilisant la stack MERN.

### 🎯 Objectifs

- Apprendre par la pratique avec un équilibre théorie/pratique
- Progression pédagogique rigoureuse, étape par étape
- Code commenté et expliqué pour faciliter la compréhension
- Utilisation de Git de manière pédagogique avec tags par module

## 🗂️ Structure du projet

```
MERN_JS_PROJECT/
├── docs/                    # 📚 Documentation pédagogique
│   ├── README.md           # Index des modules de cours
│   ├── module-00-template.md  # Template de référence
│   ├── module-01.md        # Modules de cours
│   └── assets/             # Images et schémas
├── src/                    # 💻 Code source (à créer)
├── tests/                  # 🧪 Tests (à créer)
├── .cursorrules            # Règles de développement
├── .gitignore              # Fichiers à ignorer
├── package.json            # Dépendances du projet
└── README.md               # Ce fichier
```

## 📚 Documentation

La documentation pédagogique complète se trouve dans le dossier **`docs/`**.

➡️ **[Commencer le cours](docs/README.md)**

Chaque module contient :
- 📖 Théorie : Concepts expliqués simplement
- 📊 Schémas : Visualisations pour mieux comprendre
- 💻 Pratique : Code commenté et détaillé
- ✅ Validation : Checklist et exercices

## 🏷️ Navigation avec Git

Ce projet utilise les **tags Git** pour marquer chaque module de cours :

```bash
# Voir tous les modules disponibles
git tag -l

# Se positionner sur un module spécifique
git checkout module-01

# Revenir à la dernière version
git checkout main

# Voir l'historique par module
git log --oneline --decorate
```

### Tags disponibles

| Tag | Description | Statut |
|-----|-------------|--------|
| `module-01` | Configuration initiale | ⏳ À venir |
| `module-02` | Serveur Express | ⏳ À venir |
| ... | ... | ... |

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v14+)
- npm ou yarn
- Git
- MongoDB

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd MERN_JS_PROJECT

# Installer les dépendances (quand package.json sera créé)
npm install

# Lancer le projet (selon le module en cours)
npm start
```

## 🎓 Pour les apprenants

### Comment utiliser ce projet ?

1. **Suivez l'ordre des modules** : Commencez par le Module 01 et progressez séquentiellement
2. **Lisez la théorie** : Comprenez les concepts avant de coder
3. **Pratiquez** : Écrivez le code vous-même, ne copiez-collez pas
4. **Validez** : Utilisez les checklist pour vérifier votre compréhension
5. **Exercez-vous** : Faites les exercices proposés pour approfondir

### Utilisation des tags Git

Les tags vous permettent de :
- Voir le code à un état précis du cours
- Revenir en arrière si besoin
- Comparer votre code avec la solution

```bash
# Comparer votre code avec le module
git diff module-01
```

## 👨‍🏫 Pour les formateurs

Ce projet suit une **méthodologie pédagogique rigoureuse** :

- **Développement progressif** : Une complexité à la fois
- **Documentation intégrée** : Théorie et pratique liées
- **Commits atomiques** : Chaque commit = un concept
- **Tags pédagogiques** : Points de contrôle pour les apprenants

Consultez le fichier `.cursorrules` pour les règles détaillées.

## 🛠️ Stack technique

- **Backend** : Node.js + Express
- **Base de données** : MongoDB + Mongoose
- **Frontend** : React + React Router
- **Outils** : Git, npm, etc.

## 📋 Modules prévus

1. Configuration initiale et environnement
2. Serveur Express de base
3. Routing et middleware
4. Connexion MongoDB
5. Modèles et schémas
6. Opérations CRUD
7. Authentification et sécurité
8. Frontend React
9. Intégration Frontend-Backend
10. Fonctionnalités avancées

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez :

- Améliorer un module existant
- Proposer un nouveau module
- Corriger une erreur
- Ajouter des exercices

Merci de respecter les conventions du fichier `.cursorrules`.

## 📝 Licence

Ce projet est sous licence [À définir] - Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation dans `docs/`
2. Vérifiez les "Problèmes courants" du module concerné
3. Ouvrez une issue sur GitHub

---

**Bon apprentissage ! 🚀**

*Projet pédagogique - Apprendre en construisant*

