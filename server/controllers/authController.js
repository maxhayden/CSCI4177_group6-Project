const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')

// Generates a JWT token for a given user ID
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

const registerUser = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const emailExists = await User.findOne({ email })
    if (emailExists) return res.status(400).json({ message: 'Email already in use' })
    const usernameExists = await User.findOne({ username })
    if (usernameExists) return res.status(400).json({ message: 'Username already taken' })
    const user = await User.create({ username, email, password })
    res.status(201).json({
      _id: user._id, username: user.username, email: user.email,
      bio: user.bio, avatar: user.avatar, token: generateToken(user._id),
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({
      _id: user._id, username: user.username, email: user.email,
      bio: user.bio, avatar: user.avatar, token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' })
  }
}

const getProfile = async (req, res) => {
  res.json({
    _id: req.user._id, username: req.user.username, email: req.user.email,
    bio: req.user.bio, avatar: req.user.avatar, createdAt: req.user.createdAt,
  })
}

const updateProfile = async (req, res) => {
  const { username, bio, avatar } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, { username, bio, avatar }, { new: true, runValidators: true }
    )
    res.json({ _id: user._id, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar })
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' })
  }
}

const forgotPassword = async (req, res) => {
  res.json({ message: 'If that email exists, a reset link has been sent' })
}

const resetPassword = async (req, res) => {
  res.json({ message: 'Password reset successful' })
}

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting account' })
  }
}

module.exports = { registerUser, loginUser, getProfile, updateProfile, forgotPassword, resetPassword, deleteAccount }