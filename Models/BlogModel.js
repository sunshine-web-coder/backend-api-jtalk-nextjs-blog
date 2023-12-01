const mongoose = require('mongoose');
const slugify = require('slugify');

// Define the list of categories
const validCategories = ['News', 'Technology', 'Programming', 'Sports', 'Entertainment', 'Travel', 'Health', 'Science'];

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    storyImg: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readingDuration: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: validCategories, // Enforce the category to be one of the valid categories
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true } // Add this line to include timestamps
);

// Middleware to generate and set the slug before saving to the database
postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Post', postSchema);
