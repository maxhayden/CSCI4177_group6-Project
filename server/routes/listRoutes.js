const express = require('express')
const {
  createList,
  getMyLists,
  getListById,
  updateList,
  deleteList,
  addGameToList,
  removeGameFromList,
  getPublicLists,
  getUserLists,
} = require('../controllers/listController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// Public
router.get('/public', protect, getPublicLists)
router.get('/user/:userId', protect, getUserLists)

// My lists (authenticated)
router.get('/my', protect, getMyLists)
router.post('/', protect, createList)

// Single list operations
router.get('/:id', protect, getListById)
router.put('/:id', protect, updateList)
router.delete('/:id', protect, deleteList)

// Game management within a list
router.post('/:id/games', protect, addGameToList)
router.delete('/:id/games/:gameId', protect, removeGameFromList)

module.exports = router
