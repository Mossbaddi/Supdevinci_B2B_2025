// Import de Mongoose pour interagir avec MongoDB
// Mongoose est un ODM (Object Data Modeling) qui facilite l'utilisation de MongoDB
const mongoose = require('mongoose');

/**
 * Configuration et connexion à la base de données MongoDB
 * Cette fonction gère la connexion à MongoDB avec gestion d'erreurs
 */
const connectDB = async () => {
    try {
        // Options de connexion Mongoose
        // Ces options sont recommandées pour éviter les warnings de dépréciation
        const options = {
            // useNewUrlParser et useUnifiedTopology sont maintenant activés par défaut
            // On peut les omettre avec Mongoose 6+
        };

        // Tentative de connexion à MongoDB
        // process.env.MONGODB_URI contient l'URL de connexion depuis le fichier .env
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);

        // Message de succès avec des informations sur la connexion
        console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
        console.log(`📊 Base de données : ${conn.connection.name}`);
        
        // Retourner la connexion pour pouvoir l'utiliser si nécessaire
        return conn;

    } catch (error) {
        // En cas d'erreur de connexion
        console.error(`❌ Erreur de connexion à MongoDB :`);
        console.error(error.message);
        
        // Arrêter l'application si la connexion échoue
        // Code 1 indique une sortie avec erreur
        process.exit(1);
    }
};

/**
 * Gestion de la fermeture gracieuse de la connexion
 * Écoute les signaux de terminaison pour fermer proprement la connexion
 */
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
    } catch (error) {
        console.error('Erreur lors de la fermeture de la connexion:', error);
    }
};

// Gestion des événements de connexion Mongoose
// Ces événements permettent de suivre l'état de la connexion

// Événement déclenché en cas d'erreur après la connexion initiale
mongoose.connection.on('error', (err) => {
    console.error('Erreur MongoDB:', err);
});

// Événement déclenché quand la connexion est perdue
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB déconnecté');
});

// Gestion de l'arrêt propre de l'application
// SIGINT est envoyé quand on fait Ctrl+C
process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

// Export des fonctions pour les utiliser dans d'autres fichiers
module.exports = { connectDB, closeDB };

