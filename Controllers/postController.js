// controllers/postController.js
const Post = require('../Models/BlogModel');
const User = require('../Models/UserModel');
const slugify = require('slugify');

const createPost = async (req, res) => {
  const { title, description, storyImg, content, readingDuration, category } = req.body;
  const { userId } = req.user;

  try {
    const newPost = new Post({
      title,
      slug: slugify(title, { lower: true }),
      description,
      storyImg,
      content,
      readingDuration,
      category,
      author: userId,
    });

    await newPost.save();

    // Update the user's posts array
    await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email profileImage slug');
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await Post.findOne({ slug }).populate('author', 'name email profileImage');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePost = async (req, res) => {
  const { slug } = req.params;
  const { title, description, storyImg, content, readingDuration, category } = req.body;
  const { userId } = req.user;

  try {
    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized. You are not the owner of this post.' });
    }

    // Update the post fields
    post.title = title;
    post.slug = slugify(title, { lower: true });
    post.description = description;
    post.storyImg = storyImg;
    post.content = content;
    post.readingDuration = readingDuration;
    post.category = category;

    await post.save();

    res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized. You are not the owner of this post.' });
    }

    // Remove the post from the user's posts array
    await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

    // Delete the post
    await post.remove();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAllPosts = async (req, res) => {
  const { userId } = req.user;

  try {
    // Find all posts by the user
    const userPosts = await Post.find({ author: userId });

    if (userPosts.length === 0) {
      return res.status(404).json({ message: 'No posts found for the user' });
    }

    // Remove all posts from the user's posts array
    await User.findByIdAndUpdate(userId, { $pullAll: { posts: userPosts.map(post => post._id) } });

    // Delete all posts
    await Post.deleteMany({ author: userId });

    res.json({ message: 'All posts deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getPostBySlug,
  deleteAllPosts,
};
