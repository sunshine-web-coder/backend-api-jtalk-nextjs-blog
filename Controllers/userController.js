const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get single user by slug
const getUserBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    
    const user = await User.findOne({ slug });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update account
const updateProfile = async (req, res) => {
  const { userId } = req.user;
  const { name, email, newPassword, newProfileImage } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is the owner of the account
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: 'Unauthorized. You are not the owner of this account.' });
      }
    }

    // Update user information
    user.name = name || user.name;
    user.email = email || user.email;

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update profile image if provided
    if (newProfileImage) {
      user.profileImage = newProfileImage;
    }

    // Save the updated user to the database
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//delete account
const deleteAccount = async (req, res) => {
  const { userId } = req.user;

  try {
    // Find the user by ID and delete
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete all users
const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany(); // This will delete all users in the collection
    res.json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  updateProfile,
  deleteAccount,
  getAllUsers,
  getUserBySlug,
  deleteAllUsers,
};
