const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const seatRoutes = require('./routes/seats.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'https://train-seat-backend.onrender.com','https://rococo-hummingbird-afeb50.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());

app.use('/api/seats', seatRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
