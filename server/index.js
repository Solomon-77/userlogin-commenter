const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const usersFilePath = path.join(__dirname, 'users.json');

fs.access(usersFilePath)
  .catch(() => fs.writeFile(usersFilePath, '{}', 'utf-8'));

app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    if (users[username]) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Register the user
    users[username] = { username, password };
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    if (!users[username] || users[username].password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/comments', async (req, res) => {
  const { username, comment } = req.body;

  try {
    // Read existing comments from file
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    // Add the new comment
    if (!users[username].comments) {
      users[username].comments = [];
    }

    // Include the currently authenticated user along with the comment
    users[username].comments.push({ comment, author: username });

    // Write the updated comments to file
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.json({ message: 'Comment posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    // Read existing comments from file
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    // Extract comments from all users
    const comments = Object.values(users).flatMap(user => user.comments || []);

    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});