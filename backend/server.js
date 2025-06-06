// server.js
// Backend Express pour le Pokédex – écrit de manière simple et humaine

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Active CORS pour autoriser les requêtes depuis le frontend Angular
app.use(cors());

// Pour analyser le corps des requêtes (si jamais tu as besoin de données POST)
// Dans ce simple exemple, nous ne traitons pas de body, mais c'est utile en général
app.use(express.json());

// Middleware pour vérifier le token d'authentification
// (Ici, c'est une simulation simple. En production, tu utiliserais par exemple JWT.)
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Si le header Authorization n'est pas présent ou mal formaté, on refuse l'accès.
    return res.status(401).json({ error: 'Accès refusé : jeton manquant ou invalide.' });
  }
  
  // Dans cet exemple, on n'effectue qu'une simple vérification.
  // Un vrai système vérifierait que le token correspond à une signature correcte.
  const token = authHeader.split(' ')[1];
  // Par exemple, pour le test, on considère le token que tu as comme valide.
  if (token !== 'f54535d82d0063c27fbd82f0c63bf8267b5827b2c1760736') {
    return res.status(403).json({ error: 'Accès refusé : jeton invalide.' });
  }
  
  // Si tout est OK, on passe au prochain middleware ou à la route
  next();
}

// Une base de données fictive de Pokémon
const pokemons = [
  { id: 1, name: 'Bulbizarre' },
  { id: 4, name: 'Salamèche' },
  { id: 7, name: 'Carapuce' },
  { id: 25, name: 'Pikachu' },
  { id: 63, name: 'Abra' },
  { id: 66, name: 'Machoc' },
  { id: 71, name: 'Empiflor' },
];

// Route pour obtenir tous les Pokémon déjà capturés (simulé)
app.get('/api/pokemons', (req, res) => {
  // Ici, on renvoie simplement tout le tableau.
  res.status(200).json({ pokemons });
});

// Route pour obtenir les informations sur une espèce (si le Pokémon est découvert)
// Cette route retourne les informations détaillées d'un Pokémon en fonction de son ID.
app.get('/api/species/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pokemon = pokemons.find(p => p.id === id);

  if (!pokemon) {
    return res.status(404).json({ error: 'Aucun Pokémon trouvé avec cet ID.' });
  }
  
  // On simule une réponse "découverte" si le Pokémon est connu,
  // sinon, dans un vrai système, on pourrait renvoyer des valeurs par défaut pour une espèce non découverte.
  res.status(200).json({
    data: {
      id: pokemon.id,
      name: pokemon.name,
      types: ['example-type'],
      description: `Description de ${pokemon.name}`,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      genre: 'Example genre',
      weight: 10,
      height: 1
    }
  });
});

// Route pour capturer un Pokémon (simulée)
// Cette route est protégée par le middleware verifyToken pour s'assurer que seul un utilisateur authentifié peut capturer.
app.post('/api/pokemons/:id/capture', verifyToken, (req, res) => {
  const pokemonId = parseInt(req.params.id, 10);
  console.log(` Requête reçue pour capturer le Pokémon avec l'identifiant ${pokemonId}`);

  const foundPokemon = pokemons.find(pokemon => pokemon.id === pokemonId);

  if (!foundPokemon) {
    console.warn(` Aucun Pokémon trouvé avec l'ID ${pokemonId}. Capture annulée.`);
    return res.status(404).json({ error: 'Ce Pokémon n’existe pas dans la base de données.' });
  }

  console.log(`Le Pokémon "${foundPokemon.name}" a bien été capturé.`);

  res.status(200).json({
    success: true,
    message: `Vous avez capturé ${foundPokemon.name} ! Bravo !`
  });
});

// Démarrage du serveur backend
app.listen(port, () => {
  console.log(` Serveur Express lancé sur http://localhost:${port}/api`);
});
