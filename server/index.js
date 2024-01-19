const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());

// Serve the static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Default route
app.get('/', (_, res) => res.send('Server is running.'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    if (error.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length === 1) {
      res.json({ message: 'Login successful', user: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post a comment
app.post('/api/comments', async (req, res) => {
  const { username, comment } = req.body;
  const timestamp = new Date();

  try {
    const result = await pool.query('UPDATE users SET comments = COALESCE(comments, \'[]\'::jsonb) || $1::jsonb WHERE username = $2 RETURNING *', [{ comment, author: username, timestamp }, username]);
    res.status(201).json({ message: 'Comment posted successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all comments
app.get('/api/comments', async (_, res) => {
  try {
    const result = await pool.query('SELECT username, comments FROM users');
    const allComments = result.rows.flatMap(user => user.comments || []);
    res.json({ comments: allComments });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all route for client-side routing
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});