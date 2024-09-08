const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todosRoutes = require('./routes/todos');
const urlShortenerRoutes = require('./routes/urlShortener');
const userRoutes = require('./routes/user');

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173'], // Adjust as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Body parser

// MongoDB connection
const dbURI = process.env.DB_CONNECTION_STRING;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Add this line to handle short URL redirects
app.use('/', urlShortenerRoutes);

// Other routes
app.use('/todos', todosRoutes);
app.use('/shorten', urlShortenerRoutes);
app.use('/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
