const User = require('../Models/UserModel');

// Follow a user
const followUser = async (req, res) => {
  const { userId } = req.user;
  const { targetUserId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: targetUserId } },
      { new: true }
    );

    const targetUser = await User.findByIdAndUpdate(
      targetUserId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    res.json({ message: 'Successfully followed user', user, targetUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { userId } = req.user;
  const { targetUserId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: targetUserId } },
      { new: true }
    );

    const targetUser = await User.findByIdAndUpdate(
      targetUserId,
      { $pull: { followers: userId } },
      { new: true }
    );

    res.json({ message: 'Successfully unfollowed user', user, targetUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};