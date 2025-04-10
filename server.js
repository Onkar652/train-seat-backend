const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const seatRoutes = require('./routes/seats.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://classy-lokum-dbab43.netlify.app',
    credentials: true
  }));
  
  
  
app.use(express.json());

app.use('/api/seats', seatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
