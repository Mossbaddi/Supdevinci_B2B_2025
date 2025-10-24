# Module 02 : Docker et MongoDB

> **Tag Git** : `module-02`  
> **Commit** : `[MODULE-02] Configuration Docker et MongoDB`

---

## 🎯 Objectifs d'apprentissage

À la fin de ce module, vous serez capable de :

- [ ] Comprendre le rôle de Docker et de la conteneurisation
- [ ] Configurer MongoDB avec Docker Compose
- [ ] Gérer un conteneur MongoDB (démarrer, arrêter, visualiser les logs)
- [ ] Utiliser les variables d'environnement pour la configuration
- [ ] Se connecter à MongoDB avec le shell mongo

## 📚 Prérequis

- Module 01 complété
- Docker Desktop installé sur votre machine
- Connaissance de base des lignes de commande
- Éditeur de code ouvert sur le projet

---

## 📖 Partie théorique (30-40%)

### Introduction

Avant de pouvoir stocker et manipuler des données dans notre blog, nous avons besoin d'une base de données. MongoDB est une base de données NoSQL orientée documents, parfaite pour apprendre les concepts de manipulation de données.

**Pourquoi Docker ?**
- Isolation : MongoDB tourne dans un conteneur séparé
- Reproductibilité : Même environnement pour tous les développeurs
- Simplicité : Pas besoin d'installer MongoDB directement sur votre machine
- Portabilité : Fonctionne de la même manière sur Windows, Mac et Linux

### Concepts clés

#### Concept 1 : Conteneurisation avec Docker

**Docker** est une plateforme qui permet de créer, déployer et exécuter des applications dans des conteneurs.

**Vocabulaire technique :**
- **Image Docker** : Template en lecture seule contenant tout le nécessaire pour exécuter une application
- **Conteneur** : Instance en cours d'exécution d'une image Docker
- **Docker Compose** : Outil pour définir et gérer des applications multi-conteneurs
- **Volume** : Mécanisme de persistance des données hors du conteneur

**Analogie :** 
- Image = Recette de cuisine
- Conteneur = Plat préparé selon la recette

#### Concept 2 : MongoDB - Base de données NoSQL

**MongoDB** est une base de données NoSQL orientée documents qui stocke les données au format JSON-like (BSON).

**Caractéristiques principales :**
- **Documents** : Équivalent des lignes en SQL, mais flexibles
- **Collections** : Équivalent des tables en SQL
- **Schéma flexible** : Pas de structure rigide imposée
- **Scalabilité** : Conçu pour gérer de gros volumes de données

**Vocabulaire MongoDB :**
- **BSON** : Binary JSON, format de stockage de MongoDB
- **Document** : Unité de base des données (similaire à un objet JSON)
- **Collection** : Groupe de documents
- **Database** : Ensemble de collections

#### Concept 3 : Variables d'environnement

Les **variables d'environnement** permettent de configurer une application sans modifier le code.

**Avantages :**
- Sécurité : Les secrets ne sont pas dans le code
- Flexibilité : Configuration différente selon l'environnement (dev, prod)
- Portabilité : Facile à adapter à différents contextes

**Format .env :**
```
CLE=valeur
AUTRE_CLE=autre_valeur
```

### Pourquoi cette approche ?

1. **Docker vs Installation locale** : Docker évite les problèmes de "ça marche sur ma machine"
2. **MongoDB vs SQL** : MongoDB est plus flexible pour débuter et s'intègre naturellement avec JavaScript
3. **Docker Compose** : Configuration déclarative simple à comprendre et modifier

---

## 📊 Schémas et visualisations

### Architecture avec Docker

```mermaid
graph TD
    A[Machine Hôte] --> B[Docker Engine]
    B --> C[Conteneur MongoDB]
    
    C --> D[Image mongo:7.0]
    C --> E[Port 27017]
    C --> F[Volumes persistants]
    
    F --> G[mongodb_data]
    F --> H[mongodb_config]
    
    I[Application Node.js] --> |Port 27017| C
    
    style C fill:#47A248
    style I fill:#68A063
```

### Flux de démarrage avec Docker Compose

```mermaid
sequenceDiagram
    participant Dev as Développeur
    participant DC as Docker Compose
    participant Docker as Docker Engine
    participant Mongo as Conteneur MongoDB
    
    Dev->>DC: docker-compose up -d
    DC->>Docker: Télécharge image mongo:7.0 (si nécessaire)
    Docker->>Mongo: Crée et démarre le conteneur
    Mongo->>Mongo: Initialise la base de données
    Mongo->>Mongo: Crée l'utilisateur admin
    Mongo-->>Dev: ✅ MongoDB prêt sur port 27017
    
    Dev->>Mongo: Connexion depuis l'app Node.js
    Mongo-->>Dev: ✅ Connexion établie
```

### Structure des données MongoDB

```mermaid
graph LR
    A[Serveur MongoDB] --> B[Database: blog_mern]
    B --> C[Collection: articles]
    B --> D[Collection: users]
    B --> E[Collection: comments]
    
    C --> F[Document 1]
    C --> G[Document 2]
    C --> H[Document N...]
    
    style A fill:#47A248
    style B fill:#589636
    style C fill:#88C149
```

---

## 💻 Partie pratique (60-70%)

### Étape 1 : Création du fichier docker-compose.yml

Docker Compose nous permet de définir la configuration de MongoDB dans un fichier YAML simple.

**Fichier : `docker-compose.yml`**

```yaml
# Configuration Docker Compose pour MongoDB
version: '3.8'

services:
  # Service MongoDB
  mongodb:
    # Image officielle MongoDB version 7.0
    image: mongo:7.0
    
    # Nom du conteneur
    container_name: blog-mongodb
    
    # Redémarrage automatique
    restart: unless-stopped
    
    # Variables d'environnement
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: adminpassword
      MONGO_INITDB_DATABASE: blog_mern
    
    # Exposition du port
    ports:
      - "27017:27017"
    
    # Volumes pour la persistance
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb

# Déclaration des volumes
volumes:
  mongodb_data:
    driver: local
  mongodb_config:
    driver: local
```

**Explication détaillée :**

1. **version: '3.8'** : Version du format Docker Compose
2. **image: mongo:7.0** : Utilise l'image officielle MongoDB version 7.0
3. **container_name** : Nom personnalisé pour identifier le conteneur
4. **restart: unless-stopped** : Redémarre automatiquement sauf si explicitement arrêté
5. **environment** : Variables pour initialiser MongoDB
   - `MONGO_INITDB_ROOT_USERNAME` : Nom d'utilisateur admin
   - `MONGO_INITDB_ROOT_PASSWORD` : Mot de passe admin
   - `MONGO_INITDB_DATABASE` : Base de données à créer au démarrage
6. **ports** : Mappe le port 27017 du conteneur vers le port 27017 de l'hôte
7. **volumes** : Persiste les données même si le conteneur est supprimé

**Points d'attention :**
- ⚠️ Le mot de passe `adminpassword` est à usage pédagogique uniquement
- 💡 Les volumes permettent de conserver les données entre les redémarrages
- 🔍 Le port 27017 est le port par défaut de MongoDB

### Étape 2 : Configuration des variables d'environnement

Créons le fichier `.env` pour stocker nos configurations sensibles.

**Fichier : `.env`**

```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration MongoDB
MONGODB_URI=mongodb://admin:adminpassword@localhost:27017/blog_mern?authSource=admin
```

**Fichier : `.env.example`** (template pour les autres développeurs)

```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration MongoDB
# Format : mongodb://username:password@host:port/database?authSource=admin
MONGODB_URI=mongodb://admin:adminpassword@localhost:27017/blog_mern?authSource=admin
```

**Explication de l'URI MongoDB :**

```
mongodb://admin:adminpassword@localhost:27017/blog_mern?authSource=admin
└─┬──┘  └─┬─┘ └────┬────┘   └──┬───┘ └─┬─┘ └──┬───┘  └─────┬──────┘
  │       │         │           │       │      │             │
Protocol  User   Password     Host    Port  Database   Auth Database
```

- **Protocol** : mongodb:// (protocole de connexion)
- **User** : admin (nom d'utilisateur)
- **Password** : adminpassword (mot de passe)
- **Host** : localhost (serveur MongoDB)
- **Port** : 27017 (port par défaut)
- **Database** : blog_mern (base de données cible)
- **authSource=admin** : Base où l'utilisateur est défini

### Étape 3 : Démarrage de MongoDB avec Docker

**Commandes Docker Compose essentielles :**

```bash
# Démarrer MongoDB en arrière-plan (-d = detached)
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f mongodb

# Arrêter MongoDB
docker-compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker-compose down -v

# Voir l'état des conteneurs
docker-compose ps

# Redémarrer le conteneur
docker-compose restart mongodb
```

**Démarrage initial :**

```bash
# Lancer MongoDB
docker-compose up -d
```

**Résultat attendu :**

```
[+] Running 3/3
 ✔ Network mern_js_project_default      Created
 ✔ Volume "mern_js_project_mongodb_data"    Created
 ✔ Container blog-mongodb               Started
```

**Vérification :**

```bash
# Vérifier que le conteneur tourne
docker-compose ps
```

**Output attendu :**

```
NAME            IMAGE       STATUS          PORTS
blog-mongodb    mongo:7.0   Up 10 seconds   0.0.0.0:27017->27017/tcp
```

### Étape 4 : Test de connexion avec le shell MongoDB

**Se connecter au shell MongoDB :**

```bash
# Option 1 : Via Docker exec
docker exec -it blog-mongodb mongosh -u admin -p adminpassword --authenticationDatabase admin

# Option 2 : Via Docker Compose
docker-compose exec mongodb mongosh -u admin -p adminpassword --authenticationDatabase admin
```

**Une fois dans le shell MongoDB :**

```javascript
// Afficher la version de MongoDB
db.version()

// Afficher les bases de données
show dbs

// Utiliser notre base de données
use blog_mern

// Afficher les collections (vide pour l'instant)
show collections

// Créer un document de test
db.test.insertOne({ message: "Hello MongoDB!", date: new Date() })

// Vérifier l'insertion
db.test.find()

// Sortir du shell
exit
```

**Résultat attendu :**

```javascript
{
  acknowledged: true,
  insertedId: ObjectId("...")
}
```

✅ Si vous voyez cet output, MongoDB fonctionne correctement !

### Étape 5 : Commandes Docker utiles

**Gestion des conteneurs :**

```bash
# Voir tous les conteneurs (même arrêtés)
docker ps -a

# Voir les logs
docker logs blog-mongodb

# Voir l'utilisation des ressources
docker stats blog-mongodb

# Inspecter le conteneur
docker inspect blog-mongodb

# Supprimer le conteneur (⚠️ après l'avoir arrêté)
docker rm blog-mongodb

# Voir les volumes
docker volume ls

# Inspecter un volume
docker volume inspect mern_js_project_mongodb_data
```

---

## 🎯 Points clés à retenir

### Résumé des concepts importants

1. **Docker** : Plateforme de conteneurisation qui isole les applications
2. **Docker Compose** : Outil pour gérer des applications multi-conteneurs avec un fichier YAML
3. **MongoDB** : Base de données NoSQL orientée documents, flexible et scalable
4. **Volumes Docker** : Permettent de persister les données hors du conteneur
5. **Variables d'environnement** : Configuration externe au code pour sécurité et flexibilité

### Checklist de validation

Avant de passer au module suivant, assurez-vous que :

- [ ] Docker Desktop est installé et fonctionne
- [ ] Le fichier docker-compose.yml est créé et valide
- [ ] MongoDB démarre correctement avec `docker-compose up -d`
- [ ] Vous pouvez vous connecter au shell MongoDB
- [ ] Vous avez créé et lu un document de test
- [ ] Les fichiers .env et .env.example sont créés
- [ ] Vous comprenez le rôle des volumes Docker

### Commandes essentielles à retenir

```bash
# Démarrer MongoDB
docker-compose up -d

# Arrêter MongoDB
docker-compose down

# Voir les logs
docker-compose logs -f mongodb

# Accéder au shell MongoDB
docker exec -it blog-mongodb mongosh -u admin -p adminpassword --authenticationDatabase admin
```

---

## 📝 Référence Git

### Commit(s) associé(s)

```bash
# Voir le commit de ce module
git show module-02
```

### Récupérer ce module

```bash
# Checkout vers ce module
git checkout module-02
```

### Fichiers créés dans ce module

- `docker-compose.yml` : Configuration de MongoDB avec Docker
- `.env` : Variables d'environnement (non versionné)
- `.env.example` : Template des variables d'environnement
- `docs/module-02.md` : Documentation de ce module

---

## ➡️ Prochaine étape

Dans le **Module 03**, nous allons aborder : **Connexion MongoDB avec Mongoose**

**Transition :** Maintenant que MongoDB est opérationnel dans Docker, nous allons connecter notre application Node.js à cette base de données en utilisant Mongoose, un ODM (Object Data Modeling) qui simplifie les interactions avec MongoDB.

---

## 📌 Notes et remarques

### Notes de développement

- MongoDB 7.0 est une version stable et moderne
- Les credentials (admin/adminpassword) sont à usage pédagogique uniquement
- En production, utilisez des mots de passe forts et des variables d'environnement sécurisées
- Les volumes Docker garantissent que vos données persistent même si le conteneur est supprimé

### Problèmes courants et solutions

**Problème 1 :** `Cannot connect to the Docker daemon`

**Solution :** Docker Desktop n'est pas démarré. Lancez Docker Desktop et attendez qu'il soit complètement démarré.

**Problème 2 :** `port 27017 is already in use`

**Solution :** Une autre instance de MongoDB tourne déjà. Arrêtez-la ou changez le port dans docker-compose.yml :
```yaml
ports:
  - "27018:27017"
```

**Problème 3 :** `Error: Authentication failed`

**Solution :** Vérifiez que vous utilisez bien `--authenticationDatabase admin` lors de la connexion, ou que vos credentials sont corrects.

**Problème 4 :** Les données sont perdues après un redémarrage

**Solution :** Vérifiez que les volumes sont bien définis dans docker-compose.yml et que vous n'utilisez pas `docker-compose down -v` qui supprime les volumes.

### Ressources complémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Documentation MongoDB](https://www.mongodb.com/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB Shell (mongosh)](https://www.mongodb.com/docs/mongodb-shell/)

---

**Dernière mise à jour :** 24 octobre 2025  
**Module :** 02/15

