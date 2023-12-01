const express = require('express');
const router = express.Router();
const userFollowController = require('../Controllers/userFollowController');
const authMiddleware = require('../Middlewares/authMiddleware');

// Follow a user
router.post('/follow-for-follow', authMiddleware, userFollowController.followUser);

// Unfollow a user
router.post('/unfollow', authMiddleware, userFollowController.unfollowUser);

module.exports = router;
