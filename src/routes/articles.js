// Import d'Express et création d'un router
// Router permet de créer des routes modulaires
const express = require('express');
const router = express.Router();

// Import du controller des articles
// Le controller contient la logique métier
const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
} = require('../controllers/articleController');

/**
 * ROUTES pour les articles
 * 
 * Structure RESTful :
 * - GET    /api/articles          → Lister tous les articles
 * - GET    /api/articles/:id      → Récupérer un article par ID
 * - POST   /api/articles          → Créer un nouvel article
 * - PUT    /api/articles/:id      → Mettre à jour un article
 * - DELETE /api/articles/:id      → Supprimer un article
 */

// ============================================
// ROUTES SPÉCIALES (doivent être avant /:id)
// ============================================

/**
 * @route   GET /api/articles/publies
 * @desc    Récupérer uniquement les articles publiés
 * @access  Public
 */
router.get('/publies', getPublishedArticles);

// ⚠️ Important : Cette route DOIT être avant /:id
// Sinon Express considérera "publies" comme un ID

// ============================================
// ROUTES CRUD BASIQUES
// ============================================

/**
 * @route   GET /api/articles
 * @desc    Récupérer tous les articles
 * @access  Public
 */
router.get('/', getAllArticles);

/**
 * @route   POST /api/articles
 * @desc    Créer un nouvel article
 * @access  Public (sera protégé plus tard)
 */
router.post('/', createArticle);

/**
 * @route   GET /api/articles/:id
 * @desc    Récupérer un article par son ID
 * @access  Public
 */
router.get('/:id', getArticleById);

/**
 * @route   PUT /api/articles/:id
 * @desc    Mettre à jour un article complet
 * @access  Public (sera protégé plus tard)
 */
router.put('/:id', updateArticle);

/**
 * @route   DELETE /api/articles/:id
 * @desc    Supprimer un article
 * @access  Public (sera protégé plus tard)
 */
router.delete('/:id', deleteArticle);

// ============================================
// ROUTES D'ACTIONS SPÉCIFIQUES
// ============================================

/**
 * @route   PATCH /api/articles/:id/publier
 * @desc    Publier un article
 * @access  Public (sera protégé plus tard)
 */
router.patch('/:id/publier', publishArticle);

// ============================================
// SYNTAXE ALTERNATIVE : Chaînage de méthodes
// ============================================

// On pourrait aussi écrire les routes comme ceci :
/*
router.route('/')
    .get(getAllArticles)      // GET /api/articles
    .post(createArticle);     // POST /api/articles

router.route('/:id')
    .get(getArticleById)      // GET /api/articles/:id
    .put(updateArticle)       // PUT /api/articles/:id
    .delete(deleteArticle);   // DELETE /api/articles/:id
*/

// Export du router pour l'utiliser dans server.js
module.exports = router;

