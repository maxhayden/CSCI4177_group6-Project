const express = require('express');
const { searchGames, getGameDetails } = require('../controllers/rawgController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search/:query', searchGames);
router.get('/:id', getGameDetails); 
module.exports = router;