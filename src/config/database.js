import mongoose from "mongoose";

/**
 * Configuration et connexion à la base de données 
 * avec gestion d'erreurs
 */
export async function connectDB() {
try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log("Youpi je suis bien connecté")

    return conn
    } catch (error) {
        console.error("Erreur de connexion à mongoDB : ")
        console.error(error.message)

        process.exit(1)
    }

}