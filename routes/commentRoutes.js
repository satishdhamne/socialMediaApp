const express = require('express');
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure the user is authenticated
const router = express.Router();

// Create a comment on a post
router.post('/postRoutes/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Content is required to post a comment.' });
    }

    const newComment = new Comment({
      postId,
      userId: req.user.id, // From the token
      content,
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a specific post
router.get('/postRoutes/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).populate('userId', 'username email');
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
