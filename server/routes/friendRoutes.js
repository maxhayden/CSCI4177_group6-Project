const express = require("express");
const { searchUser, sendRequest, getIncoming, getFriends, acceptRequest, ignoreRequest, removeFriend } = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", protect, searchUser);
router.post("/request", protect, sendRequest);
router.get("/requests/incoming", protect, getIncoming);
router.get("/list", protect, getFriends);
router.put("/request/:id/accept", protect, acceptRequest);
router.delete("/request/:id/ignore", protect, ignoreRequest);
router.delete("/:id/remove", protect, removeFriend);

module.exports = router;
