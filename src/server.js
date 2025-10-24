// Chargement des variables d'environnement depuis le fichier .env
// dotenv doit être chargé en premier pour que les variables soient disponibles
require('dotenv').config();

// Import du module Express
// Express est un framework web minimaliste pour Node.js
const express = require('express');

// Import de la fonction de connexion à MongoDB
const { connectDB } = require('./config/database');

// Création de l'application Express
// Cette instance sera le coeur de notre serveur web
const app = express();

// Configuration du port
// On utilise la variable d'environnement PORT si elle existe,
// sinon on utilise le port 3000 par défaut
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// Middleware pour parser le JSON
// Permet de lire req.body dans les requêtes POST/PUT
// Sans ce middleware, req.body serait undefined
app.use(express.json());

// Middleware pour parser les données URL-encodées (formulaires)
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Route de base pour tester le serveur
// GET / renvoie un message simple pour confirmer que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Blog MERN !',
        version: '1.0.0',
        status: 'Le serveur fonctionne correctement',
        endpoints: {
            articles: '/api/articles'
        }
    });
});

// Import et montage des routes des articles
// Toutes les routes commençant par /api/articles seront gérées par ce router
const articleRoutes = require('./routes/articles');
app.use('/api/articles', articleRoutes);

// Fonction asynchrone pour démarrer le serveur
// On utilise une fonction async pour pouvoir attendre la connexion à MongoDB
const startServer = async () => {
    try {
        // Étape 1 : Connexion à MongoDB
        // On attend que la connexion soit établie avant de démarrer le serveur
        await connectDB();

        // Étape 2 : Démarrage du serveur Express
        // Le serveur ne démarre que si MongoDB est connecté
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📍 URL : http://localhost:${PORT}`);
            console.log(`🌍 Environnement : ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        // Si une erreur survient pendant le démarrage
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};

// Lancement de l'application
startServer();

