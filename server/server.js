import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import connectDB from './config/db.js'
import User from './models/User.js'

dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

// Connect to MongoDB
connectDB()

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'form-server', time: new Date().toISOString() })
})

// Create User (Save to MongoDB)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, phone, country, gender, address, state, city, description } = req.body

    // Validate Mandatory Fields
    if (!name || !email || !password || !phone || !country) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Check if user already exists
    const existing = await User.findOne({ 'personal.email': email })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create User
    const user = await User.create({
      personal: { name, email, gender },
      contact: { phone, address, state, city, country },
      auth: { password: hashedPassword },
      about: { description }
    })

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.personal.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ message: 'User registered successfully', token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// LOGIN — Email or Phone + Password
app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email OR phone

    if (!identifier || !password) {
      return res.status(400).json({ error: 'identifier and password are required' });
    }

    // find by email OR phone
    const user = await User.findOne({
      $or: [
        { 'personal.email': identifier },
        { 'contact.phone': identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // compare password
    const ok = await bcrypt.compare(password, user.auth.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // issue JWT
    const token = jwt.sign(
      { id: user._id, email: user.personal.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // send safe profile (as per Return: B)
    const safeUser = {
      name: user.personal.name,
      email: user.personal.email,
      country: user.contact.country,
      createdAt: user.createdAt
    };

    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get Users (Return ONLY public profile)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    const formatted = users.map(u => ({
      name: u.personal.name,
      email: u.personal.email,
      country: u.contact.country,
      createdAt: u.createdAt
    }))

    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
