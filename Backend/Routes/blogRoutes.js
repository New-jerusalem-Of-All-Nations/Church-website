const express = require('express');
const router = express.Router();
const Blog = require('../Models/blogModels');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET all blogs (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    const blogs = await Blog.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single blog (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a new blog (ADMIN ONLY)
router.post('/', auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { title, excerpt, content, image, author, tags } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, error: "Title, excerpt, and content are required" });
    }

    const newBlog = new Blog({ title, excerpt, content, image, author, tags });
    await newBlog.save();
    res.status(201).json({ success: true, data: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update blog (ADMIN ONLY)
router.put('/:id', auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE blog (ADMIN ONLY)
router.delete('/:id', auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
