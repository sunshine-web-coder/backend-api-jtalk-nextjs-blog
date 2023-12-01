// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../Controllers/postController');
const authMiddleware = require('../Middlewares/authMiddleware');

// Create a new post
router.post('/create-post', authMiddleware, postController.createPost);

// Get all posts
router.get('/all-posts', postController.getAllPosts);

// Get a single post by slug
router.get('/posts/:slug', postController.getPostBySlug);

// Update a post
router.put('/update-post/:slug', authMiddleware, postController.updatePost);

// Delete all post
router.delete('/delete-all-posts', authMiddleware, postController.deleteAllPosts); // New route

module.exports = router;
