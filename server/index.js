const express = require('express');
const compression = require('compression');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(compression());

app.get('/', (_, res) => res.send('Server is running.'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// Register a new user
app.post('/api/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    if (error.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'User already exists' });
    }
    next(error);
  }
});

// Login endpoint
app.post('/api/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    res.json(result.rows.length === 1
      ? { message: 'Login successful', user: result.rows[0] }
      : { error: 'Invalid credentials' });
  } catch (error) {
    next(error);
  }
});

// Comments endpoints
app.route('/api/comments')
  .post(async (req, res, next) => {
    const { username, comment } = req.body;
    const timestamp = new Date();

    try {
      const result = await pool.query('UPDATE users SET comments = COALESCE(comments, \'[]\'::jsonb) || $1::jsonb WHERE username = $2 RETURNING *', [{ comment, author: username, timestamp }, username]);
      res.status(201).json({ message: 'Comment posted successfully', user: result.rows[0] });
    } catch (error) {
      next(error);
    }
  })
  .get(async (_, res, next) => {
    try {
      const users = await pool.query('SELECT username FROM users');
      const usersCommentsPromises = users.rows.map(user =>
        pool.query('SELECT comments FROM users WHERE username = $1', [user.username])
      );

      const results = await Promise.all(usersCommentsPromises);
      const comments = results.flatMap(result => result.rows[0]?.comments || []);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});