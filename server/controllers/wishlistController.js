const Wishlist = require('../models/Wishlist')

// GET /api/wishlist/my — get or lazy-create the current user's wishlist
const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, isPublic: false, games: [] })
    }
    res.json(wishlist)
  } catch (error) {
    console.error('getMyWishlist error:', error)
    res.status(500).json({ message: error.message })
  }
}

// POST /api/wishlist/games — add a game to the current user's wishlist
const addGameToWishlist = async (req, res) => {
  const { gameId, gameName, gameCover } = req.body

  if (!gameId || !gameName) {
    return res.status(400).json({ message: 'gameId and gameName are required' })
  }

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, isPublic: false, games: [] })
    }

    const alreadyAdded = wishlist.games.some((g) => g.gameId === String(gameId))
    if (alreadyAdded) {
      return res.status(409).json({ message: 'Game is already in your wishlist' })
    }

    wishlist.games.push({ gameId: String(gameId), gameName, gameCover: gameCover || '' })
    await wishlist.save()

    res.json(wishlist)
  } catch (error) {
    console.error('addGameToWishlist error:', error)
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/wishlist/games/:gameId — remove a game from the wishlist
const removeGameFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id })
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' })

    const before = wishlist.games.length
    wishlist.games = wishlist.games.filter((g) => g.gameId !== req.params.gameId)

    if (wishlist.games.length === before) {
      return res.status(404).json({ message: 'Game not found in wishlist' })
    }

    await wishlist.save()
    res.json(wishlist)
  } catch (error) {
    console.error('removeGameFromWishlist error:', error)
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/wishlist/privacy — toggle isPublic on the wishlist
const updateWishlistPrivacy = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, isPublic: false, games: [] })
    }

    wishlist.isPublic = Boolean(req.body.isPublic)
    await wishlist.save()
    res.json(wishlist)
  } catch (error) {
    console.error('updateWishlistPrivacy error:', error)
    res.status(500).json({ message: error.message })
  }
}

// GET /api/wishlist/user/:userId — view another user's wishlist (only if public)
const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId })
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' })

    const isOwner = wishlist.userId.toString() === req.user._id.toString()
    if (!wishlist.isPublic && !isOwner) {
      return res.status(403).json({ message: 'This wishlist is private' })
    }

    res.json(wishlist)
  } catch (error) {
    console.error('getUserWishlist error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getMyWishlist,
  addGameToWishlist,
  removeGameFromWishlist,
  updateWishlistPrivacy,
  getUserWishlist,
}
