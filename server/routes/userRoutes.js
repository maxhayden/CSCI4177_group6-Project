const express = require('express')
const { getUserProfile } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:username', protect, getUserProfile)

module.exports = router
