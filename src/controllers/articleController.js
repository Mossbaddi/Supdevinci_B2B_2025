// Import du modèle Article
const Article = require('../models/Article');

/**
 * CONTROLLER pour les articles
 * 
 * Un controller contient la logique métier de l'application.
 * Il reçoit les requêtes, traite les données, et retourne les réponses.
 * 
 * Séparation des responsabilités :
 * - Routes : Définissent les URL et les méthodes HTTP
 * - Controllers : Contiennent la logique métier
 * - Models : Gèrent les données et la base de données
 */

// ============================================
// CREATE - Créer un nouvel article
// ============================================

/**
 * @desc    Créer un nouvel article
 * @route   POST /api/articles
 * @access  Public (sera protégé plus tard)
 */
const createArticle = async (req, res) => {
    try {
        // Récupérer les données depuis le corps de la requête
        const { titre, contenu, auteur, categorie } = req.body;

        // Créer une nouvelle instance du modèle Article
        const article = new Article({
            titre,
            contenu,
            auteur,
            categorie
        });

        // Sauvegarder l'article dans la base de données
        // save() retourne une Promise avec le document sauvegardé
        const articleSauvegarde = await article.save();

        // Retourner une réponse avec le code 201 (Created)
        res.status(201).json({
            success: true,
            message: 'Article créé avec succès',
            data: articleSauvegarde
        });

    } catch (error) {
        // Gestion des erreurs de validation Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Autres erreurs serveur
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création',
            error: error.message
        });
    }
};

// ============================================
// READ - Lire les articles
// ============================================

/**
 * @desc    Récupérer tous les articles
 * @route   GET /api/articles
 * @access  Public
 */
const getAllArticles = async (req, res) => {
    try {
        // Récupérer tous les articles, triés par date de création (plus récent en premier)
        const articles = await Article.find().sort({ createdAt: -1 });

        // Retourner les articles avec leur nombre
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer un article par son ID
 * @route   GET /api/articles/:id
 * @access  Public
 */
const getArticleById = async (req, res) => {
    try {
        // Récupérer l'ID depuis les paramètres de l'URL
        const { id } = req.params;

        // Chercher l'article par ID
        const article = await Article.findById(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Incrémenter le nombre de vues
        await article.incrementerVues();

        // Retourner l'article
        res.status(200).json({
            success: true,
            data: article
        });

    } catch (error) {
        // Erreur si l'ID n'est pas au bon format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'article',
            error: error.message
        });
    }
};

// ============================================
// UPDATE - Mettre à jour un article
// ============================================

/**
 * @desc    Mettre à jour un article
 * @route   PUT /api/articles/:id
 * @access  Public (sera protégé plus tard)
 */
const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Chercher et mettre à jour l'article
        // { new: true } retourne le document mis à jour
        // { runValidators: true } exécute les validations du schéma
        const article = await Article.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,              // Retourne le document modifié
                runValidators: true     // Exécute les validations
            }
        );

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: article
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error.message
        });
    }
};

// ============================================
// DELETE - Supprimer un article
// ============================================

/**
 * @desc    Supprimer un article
 * @route   DELETE /api/articles/:id
 * @access  Public (sera protégé plus tard)
 */
const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Chercher et supprimer l'article
        const article = await Article.findByIdAndDelete(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article supprimé avec succès',
            data: article
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID d\'article invalide'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};

// ============================================
// ACTIONS SPÉCIALES
// ============================================

/**
 * @desc    Récupérer uniquement les articles publiés
 * @route   GET /api/articles/publies
 * @access  Public
 */
const getPublishedArticles = async (req, res) => {
    try {
        // Utiliser la méthode statique du modèle
        const articles = await Article.findPublies();

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles publiés',
            error: error.message
        });
    }
};

/**
 * @desc    Publier un article
 * @route   PATCH /api/articles/:id/publier
 * @access  Public (sera protégé plus tard)
 */
const publishArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver l'article
        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Utiliser la méthode d'instance pour publier
        await article.publier();

        res.status(200).json({
            success: true,
            message: 'Article publié avec succès',
            data: article
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la publication',
            error: error.message
        });
    }
};

// Export de toutes les fonctions du controller
module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
};

