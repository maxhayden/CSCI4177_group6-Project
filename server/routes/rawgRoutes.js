const express = require('express');
const { searchGames, getGameDetails, getRecommendations } = require('../controllers/rawgController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search/:query', searchGames);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getGameDetails);
module.exports = router;