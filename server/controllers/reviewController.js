const Review = require('../models/Review')

// POST /api/reviews — create a review (one per user per game)
const createReview = async (req, res) => {
  const { gameId, gameName, rating, reviewText } = req.body

  if (!gameId || !gameName || !rating || !reviewText) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const existing = await Review.findOne({ userId: req.user._id, gameId })
    if (existing) {
      return res.status(409).json({ message: 'You have already reviewed this game' })
    }

    const review = await Review.create({
      userId: req.user._id,
      username: req.user.username,
      gameId,
      gameName,
      rating,
      reviewText,
    })

    res.status(201).json(review)
  } catch (error) {
    console.error('createReview error:', error)
    res.status(500).json({ message: error.message })
  }
}

// GET /api/reviews/game/:gameId — get all reviews for a game (public)
const getGameReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    console.error('getGameReviews error:', error)
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/reviews/:id — update own review
const updateReview = async (req, res) => {
  const { rating, reviewText } = req.body

  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' })
    }

    review.rating = rating ?? review.rating
    review.reviewText = reviewText ?? review.reviewText
    await review.save()

    res.json(review)
  } catch (error) {
    console.error('updateReview error:', error)
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/reviews/:id — delete own review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()
    res.json({ message: 'Review deleted' })
  } catch (error) {
    console.error('deleteReview error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createReview, getGameReviews, updateReview, deleteReview }
