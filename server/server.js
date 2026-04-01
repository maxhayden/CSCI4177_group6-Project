require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const sessionRoutes = require('./routes/sessionRoutes');
const rawgRoutes = require('./routes/rawgRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const friendRoutes = require('./routes/friendRoutes');
const listRoutes = require('./routes/listRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express()

connectDB()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/sessions', sessionRoutes)

app.use('/api/games', rawgRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/wishlist', wishlistRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'Game Deck API is running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))