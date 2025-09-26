import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory user store (replace with DB later)
const users = [];

// Register (Signup)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password, pin } = req.body;

    if (!username || !password || !pin) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const newUser = { username, password: hashedPassword, pin: hashedPin };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, pin } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPinValid = await bcrypt.compare(pin, user.pin);

    if (!isPasswordValid || !isPinValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});
