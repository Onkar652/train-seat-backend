const pool = require('./config/db.js'); // Ensure path is correct

const initializeDB = async () => {
  try {
    // Create the seats table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        is_reserved BOOLEAN DEFAULT FALSE
      );
    `);

    // Check the number of rows in the seats table
    const result = await pool.query('SELECT COUNT(*) FROM seats');
    if (parseInt(result.rows[0].count) === 0) {
      // Insert default seat data if table is empty
      await pool.query(`
        INSERT INTO seats (is_reserved)
        SELECT FALSE FROM generate_series(1, 80);
      `);
      console.log("Seats initialized!");
    } else {
      console.log("Seats already initialized!");
    }
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
};

initializeDB();
