const searchGames = async (req, res) => {
    const query = req.params.query;
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${query}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching games from RAWG' });
    }
};

const getGameDetails = async (req, res) => {
    const gameId = req.params.id;
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWG_API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching game details from RAWG' });
    }
};

// GET /api/games/:id/recommendations — similar games based on genres
const getRecommendations = async (req, res) => {
  const gameId = req.params.id
  try {
    // Fetch the current game to get its genres
    const gameRes = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${process.env.RAWG_API_KEY}`)
    const game = await gameRes.json()

    if (!game.genres || game.genres.length === 0) {
      return res.json({ results: [] })
    }

    const genreIds = game.genres.map(g => g.id).join(',')
    const recRes = await fetch(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&genres=${genreIds}&ordering=-rating&page_size=6`
    )
    const data = await recRes.json()

    // Exclude the current game from results
    const filtered = (data.results || []).filter(g => String(g.id) !== String(gameId))
    res.json({ results: filtered.slice(0, 5) })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching recommendations' })
  }
}

const browseGames = async (req, res) => {
    const { genres, ordering = '-rating', page = 1, page_size = 20 } = req.query;
    try {
        let url = `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&ordering=${ordering}&page=${page}&page_size=${page_size}`;
        if (genres) url += `&genres=${genres}`;
        const response = await fetch(url);
        const data = await response.json();
        if (ordering === '-rating') {
            data.results = (data.results || []).filter(g => g.rating > 0);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching games from RAWG' });
    }
};

module.exports = { searchGames, getGameDetails, getRecommendations, browseGames };
