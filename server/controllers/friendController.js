const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// Search for a user by username so the current user can send them a friend request.
const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({ message: "Cannot send a request to yourself" });
    }

    res.json({ _id: user._id, username: user.username, avatar: user.avatar });
  } catch (error) {
    console.error("Failed to search user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Send a friend request to another user, prevents duplicate friend requests.
const sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromId = req.user._id;

    const requestAtoB = await FriendRequest.findOne({ from: fromId, to: toUserId });
    if (requestAtoB) {
      if (requestAtoB.status === "accepted") return res.status(400).json({ message: "Already friends" });
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const requestBtoA = await FriendRequest.findOne({ from: toUserId, to: fromId });
    if (requestBtoA) {
      if (requestBtoA.status === "accepted") return res.status(400).json({ message: "Already friends" });
      return res.status(400).json({ message: "This user already sent you a friend request" });
    }

    const newRequest = new FriendRequest({ from: fromId, to: toUserId });
    await newRequest.save();
    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Failed to send friend request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending friend requests that other users have sent to the current user.
const getIncoming = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.user._id, status: "pending" })
      .populate("from", "username avatar");
    res.json(requests);
  } catch (error) {
    console.error("Failed to get incoming requests:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get the current user's full friends list.
const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendships = await FriendRequest.find({
      status: "accepted",
      $or: [{ from: userId }, { to: userId }],
    })
      .populate("from", "username avatar")
      .populate("to", "username avatar");

    const friends = [];
    for (let i = 0; i < friendships.length; i++) {
      const f = friendships[i];
      let friend;
      if (f.from._id.equals(userId)) {
        friend = f.to;
      } else {
        friend = f.from;
      }
      friends.push({ requestId: f._id, user: friend });
    }

    res.json(friends);
  } catch (error) {
    console.error("Failed to get friends list:", error);
    res.status(500).json({ message: error.message });
  }
};

// Accept an incoming friend request.
const acceptRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (!request.to.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    request.status = "accepted";
    await request.save();
    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Failed to accept request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Ignore an incoming friend request by deleting it.
const ignoreRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (!request.to.equals(req.user._id)) return res.status(403).json({ message: "Not authorized" });

    await request.deleteOne();
    res.json({ message: "Friend request ignored" });
  } catch (error) {
    console.error("Failed to ignore request:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove an existing friend by deleting the friendship record.
const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendship = await FriendRequest.findById(req.params.id);
    if (!friendship) return res.status(404).json({ message: "Friendship not found" });

    if (!friendship.from.equals(userId) && !friendship.to.equals(userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await friendship.deleteOne();
    res.json({ message: "Friend removed" });
  } catch (error) {
    console.error("Failed to remove friend:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchUser, sendRequest, getIncoming, getFriends, acceptRequest, ignoreRequest, removeFriend };
