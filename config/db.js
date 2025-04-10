const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgresql:yourpassword@your-db-url:5432/train_reservation_5bl8',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
