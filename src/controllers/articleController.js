import { Article } from "../models/Article.js";

async function createArticle(req, res) {
  // Logique pour créer un article

  // Récupérer les données du corps de la requête
  // titre = req.body.titre;
  // contenu = req.body.contenu;
  // auteur = req.body.auteur;
  // categorie = req.body.categorie;

  try {
    const { titre, contenu, auteur, categorie } = req.body;

    // A partir de ces données, créer un nouvel article à enregistrer
    const nouvelArticle = new Article({
      titre,
      contenu,
      auteur,
      categorie,
    });

    // Sauvegarder l'article en base de données
    const articleEnregistre = await nouvelArticle.save();

    // Retourner une réponse au client
    res.json({
      message: "Article créé avec succès",
      article: articleEnregistre,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
        // Récuperer les messages d'erreur de validation
        // error.errors contient un objet avec les erreurs de validation pour chaque champ
        // Object.values(error.errors) permet d'obtenir un tableau des erreurs

        // let tableau = [ 1, 2, 3, 4, 5]
        // (element) => element * 2
        //  function(element) { return element * 2 }
        // function(1)


        // tableau.map( (element) => element * 2 ) // [2, 4, 6, 8, 10]
        const messages = Object.values(error.errors).map(err => err.message);
        

        // Ici, le return sert à sortir de la fonction après avoir envoyé la réponse
        return res.status(400).json({
          message: "Erreur de validation des données",
          messages: messages,
        });
    }
    console.error("Erreur lors de la création de l'article : ", error);
    res.status(500).json({
        message: "Erreur serveur lors de la création de l'article",
    });
  }
}

export { createArticle };
