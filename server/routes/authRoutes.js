const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)
router.delete('/profile', protect, deleteAccount)

module.exports = router