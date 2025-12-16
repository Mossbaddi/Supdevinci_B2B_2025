import mongoose from "mongoose";


/**
 * Schéma Mongoose pour les articles du blog
 * 
 * Ici, je définis à quoi doit ressembler mon document en base de données
 */
const articleSchema = new Mongoose.Schema({
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
})


articleSchema.methods.publier = function() {
    this.publie = true
    return this.save()
}




export const Article = mongoose.model('Article', articleSchema)