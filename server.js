const express = require ('express');
const bodyParser = require ('body-parser');
const cors = require ('cors');
const connectDB = require ('./Config/db'); // Assuming you have a db.js file
const authRoutes = require ('./Routes/authRoutes');
const userRoutes = require ('./Routes/userRoutes');
const userFollowRoutes = require ('./Routes/userFollowRoutes');
const postRoutes = require ('./Routes/postRoutes');
const authMiddleware = require ('./Middlewares/authMiddleware'); // Assuming you have an authMiddleware.js file
require ('dotenv').config ();

const app = express ();
const PORT = process.env.PORT || 5000;

app.use (cors ());
app.use (bodyParser.json ());

// Connect to MongoDB
connectDB ();

// Routes
app.use ('/api/auth', authRoutes);
app.use ('/api/user', userRoutes); // Protected route, requires authentication
app.use ('/api/user', authMiddleware, userFollowRoutes); // Protected route, requires authentication
app.use ('/api/post', postRoutes);

app.listen (PORT, () => {
  console.log (`Server is running on port ${PORT}`);
});
