const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all seats
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM seats ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching seats:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reserve seats - supports both 'count' and 'seat_ids'
router.post('/reserve', async (req, res) => {
  const { count, seat_ids } = req.body;

  // Reserve by seat IDs
  if (seat_ids && Array.isArray(seat_ids)) {
    try {
      const query = `
        UPDATE seats
        SET is_reserved = TRUE
        WHERE id = ANY($1::int[])
      `;
      await pool.query(query, [seat_ids]);
      return res.json({ message: 'Seats reserved successfully', seats: seat_ids });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Reserve by count (1-7)
  if (!count || count < 1 || count > 7) {
    return res.status(400).json({ error: 'You can reserve between 1 to 7 seats only.' });
  }

  try {
    const result = await pool.query('SELECT * FROM seats WHERE is_reserved = FALSE ORDER BY id');
    const availableSeats = result.rows;

    if (availableSeats.length < count) {
      return res.status(400).json({ error: 'Not enough seats available.' });
    }

    // Group available seats by row
    const groupedByRow = {};
    for (let seat of availableSeats) {
      const row = seat.id <= 77 ? Math.ceil(seat.id / 7) : 12; // row 12 has 3 seats
      if (!groupedByRow[row]) groupedByRow[row] = [];
      groupedByRow[row].push(seat);
    }

    // Try to find count seats in the same row
    let selectedSeats = [];
    for (let row in groupedByRow) {
      if (groupedByRow[row].length >= count) {
        selectedSeats = groupedByRow[row].slice(0, count);
        break;
      }
    }

    // If not possible, pick nearest available seats
    if (selectedSeats.length === 0) {
      selectedSeats = availableSeats.slice(0, count);
    }

    const ids = selectedSeats.map(seat => seat.id);

    await pool.query(
      `UPDATE seats SET is_reserved = TRUE WHERE id = ANY($1::int[])`,
      [ids]
    );

    res.json({ message: 'Seats reserved successfully', seats: ids });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset all seats (for testing/admin)
router.post('/reset', async (req, res) => {
  try {
    await pool.query('UPDATE seats SET is_reserved = FALSE');
    res.json({ message: 'All seats have been reset' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
