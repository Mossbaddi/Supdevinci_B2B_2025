// Import de Mongoose pour définir le schéma et le modèle
const mongoose = require('mongoose');

/**
 * Schéma Mongoose pour les articles du blog
 * 
 * Un schéma définit la structure d'un document dans MongoDB :
 * - Les champs et leurs types
 * - Les validations
 * - Les valeurs par défaut
 * - Les options de configuration
 */
const articleSchema = new mongoose.Schema(
    {
        // Titre de l'article
        titre: {
            type: String,              // Type de donnée : chaîne de caractères
            required: [true, 'Le titre est obligatoire'],  // Validation : champ requis
            trim: true,                // Supprime les espaces au début et à la fin
            minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
            maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
        },

        // Contenu de l'article
        contenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            minlength: [10, 'Le contenu doit contenir au moins 10 caractères']
        },

        // Auteur de l'article
        auteur: {
            type: String,
            required: [true, 'L\'auteur est obligatoire'],
            trim: true,
            maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']
        },

        // Statut de publication
        publie: {
            type: Boolean,             // Type : vrai ou faux
            default: false             // Par défaut, l'article n'est pas publié
        },

        // Catégorie de l'article (optionnel)
        categorie: {
            type: String,
            trim: true,
            enum: {                    // Liste de valeurs autorisées
                values: ['Technologie', 'Lifestyle', 'Voyage', 'Cuisine', 'Autre'],
                message: '{VALUE} n\'est pas une catégorie valide'
            },
            default: 'Autre'
        },

        // Nombre de vues (pour les statistiques)
        vues: {
            type: Number,
            default: 0,
            min: [0, 'Le nombre de vues ne peut pas être négatif']
        }
    },
    {
        // Options du schéma
        
        // timestamps ajoute automatiquement createdAt et updatedAt
        timestamps: true,
        
        // Permet de contrôler le comportement de toJSON()
        toJSON: {
            virtuals: true,            // Inclut les champs virtuels
            transform: function(doc, ret) {
                // Supprimer le champ __v (version key de Mongoose)
                delete ret.__v;
                return ret;
            }
        }
    }
);

// ============================================
// MÉTHODES D'INSTANCE
// ============================================

/**
 * Méthode pour publier un article
 * Utilisable sur une instance : article.publier()
 */
articleSchema.methods.publier = function() {
    this.publie = true;
    return this.save();
};

/**
 * Méthode pour dépublier un article
 */
articleSchema.methods.depublier = function() {
    this.publie = false;
    return this.save();
};

/**
 * Méthode pour incrémenter le nombre de vues
 */
articleSchema.methods.incrementerVues = function() {
    this.vues += 1;
    return this.save();
};

// ============================================
// MÉTHODES STATIQUES
// ============================================

/**
 * Méthode statique pour trouver les articles publiés
 * Utilisable sur le modèle : Article.findPublies()
 */
articleSchema.statics.findPublies = function() {
    return this.find({ publie: true }).sort({ createdAt: -1 });
};

/**
 * Méthode statique pour trouver les articles par catégorie
 */
articleSchema.statics.findByCategorie = function(categorie) {
    return this.find({ categorie, publie: true }).sort({ createdAt: -1 });
};

// ============================================
// CHAMPS VIRTUELS
// ============================================

/**
 * Champ virtuel : résumé de l'article
 * Retourne les 150 premiers caractères du contenu
 * Ce champ n'est pas stocké dans la base de données
 */
articleSchema.virtual('resume').get(function() {
    if (this.contenu.length <= 150) {
        return this.contenu;
    }
    return this.contenu.substring(0, 150) + '...';
});

/**
 * Champ virtuel : durée de lecture estimée
 * Basée sur une vitesse de lecture de 200 mots/minute
 */
articleSchema.virtual('dureeIecture').get(function() {
    const mots = this.contenu.split(' ').length;
    const minutes = Math.ceil(mots / 200);
    return minutes;
});

// ============================================
// MIDDLEWARE (HOOKS)
// ============================================

/**
 * Middleware pre-save
 * Exécuté AVANT la sauvegarde du document
 */
articleSchema.pre('save', function(next) {
    // On peut ajouter de la logique avant la sauvegarde
    // Par exemple, nettoyer les données, logger, etc.
    
    console.log(`💾 Sauvegarde de l'article : ${this.titre}`);
    
    // Appeler next() pour continuer le processus de sauvegarde
    next();
});

/**
 * Middleware post-save
 * Exécuté APRÈS la sauvegarde du document
 */
articleSchema.post('save', function(doc) {
    console.log(`✅ Article sauvegardé : ${doc._id}`);
});

// ============================================
// CRÉATION DU MODÈLE
// ============================================

/**
 * Création du modèle Article à partir du schéma
 * 
 * Le premier argument est le nom du modèle (singulier, majuscule)
 * Mongoose le pluralisera automatiquement pour créer la collection 'articles'
 * 
 * Le modèle est un constructeur compilé depuis le schéma
 * Il permet de créer et manipuler des documents
 */
const Article = mongoose.model('Article', articleSchema);

// Export du modèle pour l'utiliser dans d'autres fichiers
module.exports = Article;

