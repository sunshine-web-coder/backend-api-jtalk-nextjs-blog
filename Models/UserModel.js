const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // Assuming the image URL is stored as a string
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate and set the slug before saving to the database
// userSchema.pre('save', function (next) {
//   // Use a combination of name and ID for the slug
//   const baseSlug = slugify(this.name, { lower: true });
//   this.slug = `${baseSlug}-${this._id}`;
//   next();
// });

// Middleware to generate and set the slug from email before saving to the database
userSchema.pre('save', function (next) {
  // Extract the part before @ in the email and use it for the slug
  const emailParts = this.email.split('@');
  const formattedEmail = emailParts[0];
  this.slug = formattedEmail;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
