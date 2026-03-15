const express = require('express')
const { createReview, getGameReviews, updateReview, deleteReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createReview)
router.get('/game/:gameId', getGameReviews)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)

module.exports = router
