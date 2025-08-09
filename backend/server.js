// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

// Import your routes
const formRoutes = require('./routes/formRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Allows cross-origin requests (from your frontend)
app.use(express.json()); // Allows parsing of JSON in request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
// Any request starting with /api will be handled by formRoutes
app.use('/api', formRoutes);

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});