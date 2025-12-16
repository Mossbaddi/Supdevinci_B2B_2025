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

    },
    auteur: {

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


export const Article = mongoose.model('Article', articleSchema)