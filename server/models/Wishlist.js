const mongoose = require('mongoose')

const GameEntrySchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    gameCover: { type: String, default: '' },
  },
  { _id: false }
)

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    games: {
      type: [GameEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Wishlist', WishlistSchema)
