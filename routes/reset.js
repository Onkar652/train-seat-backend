// Reset all seats
router.post('/reset', async (req, res) => {
    try {
      await pool.query('UPDATE seats SET is_reserved = FALSE');
      res.json({ message: 'All seats have been reset' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  