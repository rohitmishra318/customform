// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

// Import your routes
const formRoutes = require('./routes/formRoutes');

// Initialize Express app
const app = express();

// --- CORRECTED CORS CONFIGURATION ---
// Define the list of websites that are allowed to connect to your backend
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for testing
  'https://customform-cqlk.vercel.app' // Your live frontend on Vercel
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from the whitelist
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Middleware
app.use(cors(corsOptions)); // Use the new CORS options
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