const express = require('express');
const mongoose = require('mongoose');
const todosRoutes = require('./routes/todos');
const urlShortenerRoutes = require('./routes/urlShortener');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors());
// Middleware
app.use(express.json());

// Database connection
const dbURI = process.env.DB_CONNECTION_STRING;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/todos', todosRoutes);
app.use('/', urlShortenerRoutes); // '/' to access shorten and redirect routes

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
