const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the JWT auth middleware
const Post = require('../models/Post'); // Import the Post model
const router = express.Router();

// Create a new post (protected route)
router.post('/create', authMiddleware, async (req, res) => {
    const { title, content } = req.body; // Post content from the request body

    console.log(`req.user in /postRoutes/create`, req.user);

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        // Create a new post
        const post = new Post({
            userId: req.user.userId, // Get the userId from the decoded JWT token
            
            content,
            title,

        });

        console.log("post after creation in /create", post);
        // Save the post to the database
        await post.save();
        console.log("post is created");

        res.status(201).json({ message: 'Post created successfully', post });

    } catch (error) {
        console.error('Error in post creation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
































