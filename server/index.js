const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);

    res.json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments', async (req, res) => {
  const { username, comment } = req.body;

  try {
    const result = await pool.query('UPDATE users SET comments = COALESCE(comments, \'[]\'::jsonb) || $1::jsonb WHERE username = $2 RETURNING *', [{ comment, author: username }, username]);

    res.json({ message: 'Comment posted successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const result = await pool.query('SELECT comments FROM users');

    // Extract comments from all users
    const comments = result.rows.flatMap(user => user.comments || []);

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});