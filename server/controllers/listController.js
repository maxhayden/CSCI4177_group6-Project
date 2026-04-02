const List = require('../models/List')
const User = require('../models/User')
const FriendRequest = require('../models/FriendRequest')

// POST /api/lists — create a new list
const createList = async (req, res) => {
  const { name, description, isPublic } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'List name is required' })
  }

  try {
    const list = await List.create({
      ownerId: req.user._id,
      ownerUsername: req.user.username,
      name: name.trim(),
      description: description?.trim() || '',
      isPublic: Boolean(isPublic),
      games: [],
    })

    res.status(201).json(list)
  } catch (error) {
    console.error('createList error:', error)
    res.status(500).json({ message: error.message })
  }
}

// GET /api/lists/my — get all lists for the logged-in user
const getMyLists = async (req, res) => {
  try {
    const lists = await List.find({ ownerId: req.user._id }).sort({ createdAt: -1 })
    res.json(lists)
  } catch (error) {
    console.error('getMyLists error:', error)
    res.status(500).json({ message: error.message })
  }
}

// GET /api/lists/:id — get a single list by ID
const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    // Only owner can view private lists
    const isOwner = list.ownerId.toString() === req.user._id.toString()
    if (!list.isPublic && !isOwner) {
      return res.status(403).json({ message: 'This list is private' })
    }

    res.json(list)
  } catch (error) {
    console.error('getListById error:', error)
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/lists/:id — update list name, description, or privacy
const updateList = async (req, res) => {
  const { name, description, isPublic } = req.body

  try {
    const list = await List.findById(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    if (list.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this list' })
    }

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'List name cannot be empty' })
      list.name = name.trim()
    }
    if (description !== undefined) list.description = description.trim()
    if (isPublic !== undefined) list.isPublic = Boolean(isPublic)

    await list.save()
    res.json(list)
  } catch (error) {
    console.error('updateList error:', error)
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/lists/:id — delete a list
const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    if (list.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this list' })
    }

    await list.deleteOne()
    res.json({ message: 'List deleted successfully' })
  } catch (error) {
    console.error('deleteList error:', error)
    res.status(500).json({ message: error.message })
  }
}

// POST /api/lists/:id/games — add a game to a list
const addGameToList = async (req, res) => {
  const { gameId, gameName, gameCover } = req.body

  if (!gameId || !gameName) {
    return res.status(400).json({ message: 'gameId and gameName are required' })
  }

  try {
    const list = await List.findById(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    if (list.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this list' })
    }

    const alreadyAdded = list.games.some((g) => g.gameId === String(gameId))
    if (alreadyAdded) {
      return res.status(409).json({ message: 'Game is already in this list' })
    }

    list.games.push({ gameId: String(gameId), gameName, gameCover: gameCover || '' })
    await list.save()

    res.json(list)
  } catch (error) {
    console.error('addGameToList error:', error)
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/lists/:id/games/:gameId — remove a game from a list
const removeGameFromList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })

    if (list.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this list' })
    }

    const before = list.games.length
    list.games = list.games.filter((g) => g.gameId !== req.params.gameId)

    if (list.games.length === before) {
      return res.status(404).json({ message: 'Game not found in this list' })
    }

    await list.save()
    res.json(list)
  } catch (error) {
    console.error('removeGameFromList error:', error)
    res.status(500).json({ message: error.message })
  }
}

// GET /api/lists/public — get all public lists (for browsing)
const getPublicLists = async (req, res) => {
  try {
    const lists = await List.find({ isPublic: true }).sort({ createdAt: -1 }).limit(50)
    res.json(lists)
  } catch (error) {
    console.error('getPublicLists error:', error)
    res.status(500).json({ message: error.message })
  }
}

// get public lists for a user, respecting profile privacy
const getUserLists = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId)
    if (!targetUser) return res.status(404).json({ message: 'User not found' })

    const isOwner = targetUser._id.equals(req.user._id)

    if (isOwner) {
      const lists = await List.find({ ownerId: req.params.userId }).sort({ createdAt: -1 })
      return res.json(lists)
    }

    // Check profile privacy
    if (targetUser.isPublic === false) {
      const friendship = await FriendRequest.findOne({
        status: 'accepted',
        $or: [
          { from: req.user._id, to: targetUser._id },
          { from: targetUser._id, to: req.user._id },
        ],
      })
      if (!friendship) return res.status(403).json({ message: 'This profile is private' })
    }

    // Only return public lists
    const lists = await List.find({ ownerId: req.params.userId, isPublic: true }).sort({ createdAt: -1 })
    res.json(lists)
  } catch (error) {
    console.error('getUserLists error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createList,
  getMyLists,
  getListById,
  updateList,
  deleteList,
  addGameToList,
  removeGameFromList,
  getPublicLists,
  getUserLists,
}
