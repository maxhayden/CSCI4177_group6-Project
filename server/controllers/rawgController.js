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

module.exports = { searchGames, getGameDetails };
