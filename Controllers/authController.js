const User = require ('../Models/UserModel');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const { default: slugify } = require('slugify');

// Register user
const register = async (req, res) => {
  const {name, email, password, profileImage} = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne ({email});

    if (existingUser) {
      return res
        .status (400)
        .json ({message: 'User with this email already exists'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash (password, 10);

    // Create a new user
    const newUser = new User ({
      name,
      email,
      slug: slugify(name, { lower: true }),
      password: hashedPassword,
      profileImage,
    });

    // Save the user to the database
    await newUser.save ();

    res
      .status (201)
      .json ({message: 'User registered successfully', user: newUser});
  } catch (error) {
    console.error (error);
    res.status (500).json ({message: 'Internal server error'});
  }
};

//Login user
const login = async (req, res) => {
  const {email, password} = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne ({email});

    if (!user) {
      return res.status (401).json ({message: 'Invalid credentials'});
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare (password, user.password);

    if (!isPasswordValid) {
      return res.status (401).json ({message: 'Invalid credentials'});
    }

    // Generate JWT token
    const token = jwt.sign ({userId: user._id}, process.env.jwtSecret, {
      expiresIn: '1h',
    });

    res.json ({token, userId: user._id, user});
  } catch (error) {
    console.error (error);
    res.status (500).json ({message: 'Internal server error'});
  }
};

module.exports = {
  register,
  login,
};
