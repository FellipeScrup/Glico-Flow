// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'https://ee9c-186-224-145-64.ngrok-free.app'], // Lista de origens permitidas
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
