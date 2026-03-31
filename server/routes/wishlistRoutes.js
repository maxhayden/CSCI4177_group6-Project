const express = require('express')
const {
  getMyWishlist,
  addGameToWishlist,
  removeGameFromWishlist,
  updateWishlistPrivacy,
  getUserWishlist,
} = require('../controllers/wishlistController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/my', protect, getMyWishlist)
router.post('/games', protect, addGameToWishlist)
router.delete('/games/:gameId', protect, removeGameFromWishlist)
router.put('/privacy', protect, updateWishlistPrivacy)
router.get('/user/:userId', protect, getUserWishlist)

module.exports = router
