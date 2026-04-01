const mongoose = require('mongoose')

const GameEntrySchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    gameCover: { type: String, default: '' },
  },
  { _id: false }
)

const ListSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerUsername: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'List name is required'],
      trim: true,
      maxlength: [100, 'List name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
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

module.exports = mongoose.model('List', ListSchema)
