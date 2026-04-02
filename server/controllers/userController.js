const User = require('../models/User')
const FriendRequest = require('../models/FriendRequest')

// Helper: check if two users are friends
const areFriends = async (userId1, userId2) => {
  const friendship = await FriendRequest.findOne({
    status: 'accepted',
    $or: [
      { from: userId1, to: userId2 },
      { from: userId2, to: userId1 },
    ],
  })
  return !!friendship
}

// GET /api/users/:username — view another user's profile
const getUserProfile = async (req, res) => {
  try {
    const target = await User.findOne({ username: req.params.username })
    if (!target) return res.status(404).json({ message: 'User not found' })

    const isOwner = target._id.equals(req.user._id)

    if (isOwner) {
      return res.json({
        _id: target._id,
        username: target.username,
        bio: target.bio,
        avatar: target.avatar,
        isPublic: target.isPublic,
        isOwner: true,
      })
    }

    const friend = await areFriends(req.user._id, target._id)
    const canView = target.isPublic !== false || friend

    if (!canView) {
      return res.json({
        _id: target._id,
        username: target.username,
        isPublic: false,
        isOwner: false,
        restricted: true,
      })
    }

    res.json({
      _id: target._id,
      username: target.username,
      bio: target.bio,
      avatar: target.avatar,
      isPublic: target.isPublic,
      isOwner: false,
      restricted: false,
    })
  } catch (error) {
    console.error('getUserProfile error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getUserProfile }
