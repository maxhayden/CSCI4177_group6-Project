const express = require('express');
const { logSession, getAggregatedStats } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/log', protect, logSession);
router.get('/stats', protect, getAggregatedStats);

module.exports = router;