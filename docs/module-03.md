# Module 03 : Connexion MongoDB avec Mongoose

> **Tag Git** : `module-03`  
> **Commit** : `[MODULE-03] Connexion MongoDB avec Mongoose`

---

## 🎯 Objectifs d'apprentissage

À la fin de ce module, vous serez capable de :

- [ ] Comprendre le rôle de Mongoose comme ODM
- [ ] Configurer la connexion à MongoDB depuis Node.js
- [ ] Gérer les variables d'environnement avec dotenv
- [ ] Gérer les erreurs de connexion
- [ ] Implémenter un démarrage d'application robuste

## 📚 Prérequis

- Module 01 et 02 complétés
- MongoDB en cours d'exécution (Docker)
- Connaissance des Promises et async/await en JavaScript

---

## 📖 Partie théorique (30-40%)

### Introduction

Dans le Module 02, nous avons mis en place MongoDB avec Docker. Maintenant, il est temps de connecter notre application Node.js à cette base de données. Pour cela, nous utilisons **Mongoose**, un outil qui simplifie grandement les interactions avec MongoDB.

**Pourquoi Mongoose ?**
- Schémas et validation des données
- API simple et intuitive
- Middleware et hooks pour la logique métier
- Population automatique des relations
- Queries builder puissant

### Concepts clés

#### Concept 1 : ODM (Object Data Modeling)

**Mongoose** est un ODM pour MongoDB et Node.js. Il permet de modéliser les données de l'application avec des schémas.

**ODM vs ORM :**
- **ORM (Object-Relational Mapping)** : Pour bases SQL (ex: Sequelize, TypeORM)
- **ODM (Object Document Mapping)** : Pour bases NoSQL (ex: Mongoose)

**Avantages de Mongoose :**
- **Schémas** : Structure et validation des données
- **Models** : Constructeurs pour créer et lire des documents
- **Middleware** : Hooks before/after certaines opérations
- **Plugins** : Fonctionnalités réutilisables
- **Validation** : Intégrée et personnalisable

**Vocabulaire technique :**
- **Schema** : Définition de la structure d'un document
- **Model** : Classe compilée depuis un schéma
- **Document** : Instance d'un model (= un enregistrement)
- **Query** : Requête pour récupérer/modifier des données

#### Concept 2 : Variables d'environnement avec dotenv

Les **variables d'environnement** stockent des configurations sensibles hors du code source.

**dotenv** charge ces variables depuis un fichier `.env` vers `process.env`.

**Pourquoi utiliser dotenv ?**
- Sécurité : Mots de passe et clés ne sont pas dans Git
- Flexibilité : Configuration différente par environnement (dev, test, prod)
- Simplicité : Un seul fichier `.env` à gérer

**Format du fichier .env :**
```env
CLE=valeur
AUTRE_CLE=autre_valeur
```

**Utilisation en JavaScript :**
```javascript
require('dotenv').config();
console.log(process.env.CLE); // "valeur"
```

#### Concept 3 : Connexion asynchrone et gestion d'erreurs

La connexion à MongoDB est une opération **asynchrone** : elle prend du temps.

**Pattern async/await :**
```javascript
async function connecter() {
    try {
        await mongoose.connect(url);
        console.log('Connecté');
    } catch (error) {
        console.error('Erreur:', error);
    }
}
```

**Avantages :**
- Code lisible et séquentiel
- Gestion d'erreurs avec try/catch
- Évite le "callback hell"

### Pourquoi cette approche ?

1. **Configuration centralisée** : Toute la logique de connexion dans un fichier dédié
2. **Robustesse** : Gestion des erreurs et fermeture gracieuse
3. **Réutilisabilité** : La fonction `connectDB()` peut être utilisée partout
4. **Séparation des responsabilités** : Database config ≠ Server config

---

## 📊 Schémas et visualisations

### Architecture avec Mongoose

```mermaid
graph TD
    A[Application Node.js] --> B[Mongoose ODM]
    B --> C[Driver MongoDB]
    C --> D[Conteneur MongoDB]
    
    E[src/server.js] --> F[require dotenv]
    E --> G[connectDB]
    
    F --> H[.env]
    G --> I[src/config/database.js]
    
    I --> B
    
    style B fill:#880000
    style D fill:#47A248
    style E fill:#68A063
```

### Flux de démarrage de l'application

```mermaid
sequenceDiagram
    participant App as src/server.js
    participant Env as dotenv
    participant DB as database.js
    participant Mongoose as Mongoose
    participant Mongo as MongoDB
    
    App->>Env: require('dotenv').config()
    Env->>Env: Charge .env
    Env-->>App: Variables disponibles
    
    App->>DB: await connectDB()
    DB->>Mongoose: mongoose.connect(URI)
    Mongoose->>Mongo: Tentative de connexion
    
    alt Connexion réussie
        Mongo-->>Mongoose: ✅ Connecté
        Mongoose-->>DB: Connection object
        DB-->>App: Success
        App->>App: app.listen(PORT)
        App-->>App: ✅ Serveur prêt
    else Connexion échouée
        Mongo-->>Mongoose: ❌ Erreur
        Mongoose-->>DB: Error
        DB->>DB: console.error()
        DB->>App: process.exit(1)
    end
```

### Gestion des événements Mongoose

```mermaid
stateDiagram-v2
    [*] --> Disconnected
    Disconnected --> Connecting: mongoose.connect()
    Connecting --> Connected: Succès
    Connecting --> Error: Échec
    Connected --> Disconnected: Perte de connexion
    Error --> [*]: process.exit(1)
    Connected --> Disconnected: SIGINT (Ctrl+C)
    Disconnected --> [*]: Fermeture gracieuse
```

---

## 💻 Partie pratique (60-70%)

### Étape 1 : Installation des dépendances

Nous avons besoin de deux packages :

```bash
npm install mongoose dotenv
```

**Explication :**
- **mongoose** : ODM pour MongoDB (~6 MB)
- **dotenv** : Charge les variables d'environnement (~1 MB)

**Mise à jour du package.json :**

```json
{
  "dependencies": {
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^8.0.3"
  }
}
```

### Étape 2 : Configuration du fichier .env

Assurez-vous que votre fichier `.env` contient l'URI de connexion MongoDB :

**Fichier : `.env`**

```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration MongoDB
MONGODB_URI=mongodb://admin:adminpassword@localhost:27017/blog_mern?authSource=admin
```

⚠️ **Important** : Ce fichier ne doit JAMAIS être commité sur Git (il est dans `.gitignore`)

### Étape 3 : Création du module de connexion

Créons un fichier dédié pour gérer la connexion à MongoDB.

**Fichier : `src/config/database.js`**

```javascript
// Import de Mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

/**
 * Configuration et connexion à la base de données MongoDB
 */
const connectDB = async () => {
    try {
        // Options de connexion (optionnelles avec Mongoose 6+)
        const options = {
            // Les options par défaut sont suffisantes
        };

        // Tentative de connexion à MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        // Message de succès avec informations
        console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
        console.log(`📊 Base de données : ${conn.connection.name}`);
        
        return conn;

    } catch (error) {
        // En cas d'erreur de connexion
        console.error(`❌ Erreur de connexion à MongoDB :`);
        console.error(error.message);
        
        // Arrêter l'application
        process.exit(1);
    }
};

/**
 * Fermeture gracieuse de la connexion
 */
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
    } catch (error) {
        console.error('Erreur lors de la fermeture:', error);
    }
};

// Événements de connexion Mongoose

mongoose.connection.on('error', (err) => {
    console.error('Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB déconnecté');
});

// Gestion du Ctrl+C
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

module.exports = { connectDB, closeDB };
```

**Explication détaillée :**

1. **`connectDB()`** : Fonction asynchrone qui se connecte à MongoDB
   - Utilise `mongoose.connect()` avec l'URI depuis `.env`
   - Retourne la connexion si succès
   - Arrête l'app si échec (`process.exit(1)`)

2. **`closeDB()`** : Ferme proprement la connexion
   - Utile pour les tests ou l'arrêt gracieux

3. **Événements Mongoose** :
   - `error` : Erreur après connexion initiale
   - `disconnected` : Connexion perdue

4. **SIGINT** : Signal envoyé lors de Ctrl+C
   - Permet de fermer proprement la connexion avant l'arrêt

**Points d'attention :**
- ⚠️ `process.exit(1)` arrête l'application avec code d'erreur
- 💡 Les événements Mongoose permettent de monitorer la connexion
- 🔍 `conn.connection.host` donne l'adresse du serveur MongoDB

### Étape 4 : Modification du serveur principal

Intégrons la connexion MongoDB dans notre serveur Express.

**Fichier : `src/server.js` (version complète)**

```javascript
// Chargement des variables d'environnement
// dotenv doit être chargé en PREMIER
require('dotenv').config();

// Import du module Express
const express = require('express');

// Import de la fonction de connexion à MongoDB
const { connectDB } = require('./config/database');

// Création de l'application Express
const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Blog MERN !',
        version: '1.0.0',
        status: 'Le serveur fonctionne correctement'
    });
});

// Fonction asynchrone pour démarrer le serveur
const startServer = async () => {
    try {
        // Étape 1 : Connexion à MongoDB
        await connectDB();

        // Étape 2 : Démarrage du serveur Express
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📍 URL : http://localhost:${PORT}`);
            console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};

// Lancement de l'application
startServer();
```

**Explication des changements :**

1. **`require('dotenv').config()`** : Charge les variables d'environnement AVANT tout
2. **`require('./config/database')`** : Import de la fonction de connexion
3. **`startServer()`** : Fonction async qui :
   - Connecte d'abord MongoDB
   - Puis démarre Express
   - Gère les erreurs de démarrage

**Ordre d'exécution :**
1. Chargement des variables d'environnement
2. Import des modules
3. Configuration d'Express
4. Appel de `startServer()`
5. Connexion à MongoDB
6. Démarrage du serveur HTTP

### Étape 5 : Test de la connexion

**Avant de tester, assurez-vous que MongoDB tourne :**

```bash
# Démarrer MongoDB avec Docker
docker-compose up -d

# Vérifier qu'il tourne
docker-compose ps
```

**Démarrage de l'application :**

```bash
npm run dev
```

**Résultat attendu :**

```
✅ MongoDB connecté : 127.0.0.1:27017
📊 Base de données : blog_mern
🚀 Serveur démarré sur le port 3000
📍 URL : http://localhost:3000
🌍 Environnement : development
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
```

✅ **Succès** : Vous voyez "MongoDB connecté" suivi du démarrage du serveur

❌ **Échec** : Message d'erreur et arrêt de l'application

**Test de la route API :**

```bash
# Dans un autre terminal
curl http://localhost:3000
```

**Réponse attendue :**

```json
{
  "message": "Bienvenue sur l'API du Blog MERN !",
  "version": "1.0.0",
  "status": "Le serveur fonctionne correctement"
}
```

### Étape 6 : Test de la fermeture gracieuse

**Test du Ctrl+C :**

1. Dans le terminal où le serveur tourne, faites `Ctrl+C`

**Résultat attendu :**

```
^C🔌 Connexion MongoDB fermée
```

Le serveur s'arrête proprement après avoir fermé la connexion MongoDB.

---

## 🎯 Points clés à retenir

### Résumé des concepts importants

1. **Mongoose** : ODM qui simplifie les interactions avec MongoDB via des schémas et modèles
2. **dotenv** : Charge les variables d'environnement depuis `.env` vers `process.env`
3. **Connexion asynchrone** : Utilisation d'async/await pour gérer la connexion
4. **Gestion d'erreurs** : Try/catch et `process.exit()` pour robustesse
5. **Fermeture gracieuse** : Écoute de SIGINT pour fermer proprement la connexion

### Checklist de validation

Avant de passer au module suivant, assurez-vous que :

- [ ] Mongoose et dotenv sont installés
- [ ] Le fichier `.env` contient MONGODB_URI
- [ ] Le fichier `src/config/database.js` existe
- [ ] `src/server.js` charge dotenv et connecte MongoDB
- [ ] Le serveur démarre avec "MongoDB connecté"
- [ ] La route GET / fonctionne toujours
- [ ] Ctrl+C ferme proprement la connexion

### Commandes essentielles à retenir

```bash
# Démarrer MongoDB
docker-compose up -d

# Démarrer l'application
npm run dev

# Arrêter l'application proprement
Ctrl + C

# Vérifier les logs MongoDB
docker-compose logs -f mongodb
```

---

## 📝 Référence Git

### Commit(s) associé(s)

```bash
# Voir le commit de ce module
git show module-03
```

### Récupérer ce module

```bash
# Checkout vers ce module
git checkout module-03
```

### Fichiers créés/modifiés dans ce module

- `src/config/database.js` : ✨ Configuration de la connexion MongoDB
- `src/server.js` : ✏️ Modifié pour intégrer la connexion MongoDB
- `package.json` : ✏️ Ajout de mongoose et dotenv
- `docs/module-03.md` : Documentation de ce module

---

## ➡️ Prochaine étape

Dans le **Module 04**, nous allons aborder : **Modèle Article (Schema Mongoose)**

**Transition :** Maintenant que notre application est connectée à MongoDB, nous pouvons créer notre premier modèle de données : le modèle Article. Nous découvrirons comment définir un schéma Mongoose avec validation et timestamps.

---

## 📌 Notes et remarques

### Notes de développement

- `dotenv` doit être chargé AVANT tous les autres imports
- La connexion MongoDB est établie AVANT le démarrage du serveur Express
- Les événements Mongoose permettent de monitorer l'état de la connexion
- `process.exit(1)` arrête Node.js avec un code d'erreur

### Problèmes courants et solutions

**Problème 1 :** `MongoServerError: Authentication failed`

**Solution :** 
- Vérifiez les credentials dans `.env` (admin/adminpassword)
- Assurez-vous d'avoir `?authSource=admin` dans l'URI
- Vérifiez que MongoDB est bien démarré

**Problème 2 :** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution :** 
- MongoDB n'est pas démarré. Lancez `docker-compose up -d`
- Vérifiez que le port 27017 est bien exposé

**Problème 3 :** `process.env.MONGODB_URI is undefined`

**Solution :** 
- Vérifiez que `.env` existe à la racine du projet
- Vérifiez que `require('dotenv').config()` est en première ligne
- Redémarrez le serveur après modification de `.env`

**Problème 4 :** Les modifications de `.env` ne sont pas prises en compte

**Solution :** 
- Arrêtez et redémarrez le serveur
- `nodemon` ne recharge pas automatiquement les variables d'environnement

### Bonnes pratiques

1. **Toujours gérer les erreurs** de connexion
2. **Fermer proprement** la connexion avant l'arrêt
3. **Ne jamais commiter** le fichier `.env`
4. **Utiliser `.env.example`** comme documentation
5. **Connecter MongoDB avant** de démarrer le serveur

### Ressources complémentaires

- [Documentation Mongoose](https://mongoosejs.com/docs/guide.html)
- [Documentation dotenv](https://github.com/motdotla/dotenv)
- [Mongoose Connection](https://mongoosejs.com/docs/connections.html)
- [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)

---

**Dernière mise à jour :** 24 octobre 2025  
**Module :** 03/15

