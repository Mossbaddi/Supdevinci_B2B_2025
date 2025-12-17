import mongoose from "mongoose";


/**
 * Schéma Mongoose pour les articles du blog
 * 
 * Ici, je définis à quoi doit ressembler mon document en base de données
 */
const articleSchema = new mongoose.Schema({
    titre: {
        type: String,
        trim: true,
        required: [true, "Le titre est obligatoire"],
        minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
        maxlength: [200, 'Le titre doit contenir moins de 200 caractères']

    },
    contenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            minlength: [10, 'Le contenu doit contenir au moins 10 caractères']

    },
    auteur: {
            type: String,
            required: [true, 'L\'auteur est obligatoire'],
            trim: true,
            maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']

    },
    publie: {
        type: Boolean,
        default: false

    },
    categorie: {
        type: String,
        enum: {
            values: ['Technologie', 'Lifestyle', 'Voyage', 'Cuisine', 'Autre'],
            message: '{VALUE} n\'est pas une catégorie valide'
        }

    },
    vues: {
        type: Number,
        default: 0,
        min: [0, 'le nombre de vues ne peut pas être négatif']

    }
}, 
{   
    // Ajout automatique des champs createdAt et updatedAt
    timestamps: true,

    toJSON: {
        virtuals: true,
    }
}
)
articleSchema.methods.publier = function() {
    this.publie = true
    return this.save()
}


articleSchema.methods.depublier = function() {
    this.publie = false
    return this.save()
}

articleSchema.methods.incrementerVues = function() {
    this.vues += 1
    return this.save()
}



articleSchema.statics.findByCategorie = function(categorie) {
    return this.find({ categorie: categorie })
}

articleSchema.statics.findPublies = function() {
    return this.find({ publie: true })
}


articleSchema.virtual('resume').get(function() {
    if (this.contenu.length <= 100) {
        return this.contenu
    }
    return this.contenu.substring(0, 100) + '...'
})

export const Article = mongoose.model('Article', articleSchema)