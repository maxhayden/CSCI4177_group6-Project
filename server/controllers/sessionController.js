const Session = require('../models/Session');
const mongoose = require('mongoose');

const logSession = async (req, res) => {
  try {
    const { gameName, duration } = req.body;
    const newSession = new Session({
      userId: req.user._id,
      gameName,
      duration
    });
    await newSession.save();
    res.status(201).json({ message: "Session logged successfully" });
  } catch (error) {
    console.error("fail to save log game data:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAggregatedStats = async (req, res) => {
  try {
    const stats = await Session.aggregate([
      { $match: { userId: req.user._id } },
      // Group by game name and play time
      { 
        $group: { 
          _id: "$gameName", 
          totalMinutes: { $sum: "$duration" } 
        } 
      }
    ]);
    res.json(stats);
  } catch (error) {
    console.error("fail to show log data", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logSession, getAggregatedStats };