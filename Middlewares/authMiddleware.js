const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    // Check if the token includes the "Bearer " prefix and remove it
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.jwtSecret);

    // Attach the decoded user information to the request
    req.user = decoded;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

module.exports = authMiddleware;
