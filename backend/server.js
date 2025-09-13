import express from 'express';
import { pool } from './db.js';

const app = express();
app.use(express.json());

app.get('/rooms', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM rooms');
  res.json(rows);
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ ok: true, result: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));
