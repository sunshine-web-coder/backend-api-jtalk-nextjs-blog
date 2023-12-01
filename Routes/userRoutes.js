const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authMiddleware = require('../Middlewares/authMiddleware');

// Get all users
router.get('/get-all-users', authMiddleware, userController.getAllUsers);
// Get a single user by slug
router.get('/:slug', userController.getUserBySlug);
// User to update their account
router.put('/update-profile', authMiddleware, userController.updateProfile);
// User to delete account
router.delete('/delete-account', authMiddleware, userController.deleteAccount);
// Only admin can delete all users account
router.delete('/delete-all-users', authMiddleware, userController.deleteAllUsers);

module.exports = router;
