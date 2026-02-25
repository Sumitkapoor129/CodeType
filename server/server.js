// This file is the entry point for the backend.
// Run with: node server/server.js
// Requires .env with MONGODB_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000','https://code-type-psi.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codetyper').then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB error', err));

// --- Models ---
const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});
const User = mongoose.model('User', userSchema);

const resultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  language: String,
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  mistakes: { type: Number, required: true },
  duration: Number,
  date: { type: Date, default: Date.now }
});

// ✅ Composite Unique Constraint
resultSchema.index(
  { userId: 1, wpm: 1, accuracy: 1, mistakes: 1 },
  { unique: true }
);
const Result = mongoose.model('Result', resultSchema);

const snippetSchema = new mongoose.Schema({
  language: String,
  code: String
});
const Snippet = mongoose.model('Snippet', snippetSchema);

// --- Auth Routes ---
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
// 1. Redirect to Google
app.get('/auth/google', (req, res) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  res.redirect(url);
});

// 2. Google Callback
app.get('/accounts/google/login/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await client.getToken(code);
    console.log(tokens);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture
      });
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
  
res.cookie('token', token, {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: '/'
});
    res.redirect('https://code-type-psi.vercel.app'); // Redirect back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Auth Error");
  }
});

// 3. Get Current User
app.get('/api/auth/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
});

// 4. Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// --- API Routes ---

// Get Random Snippet
app.get('/api/snippets/random', async (req, res) => {
  const { language } = req.query;
  try {
    // For demo purposes, if DB is empty, return static fallback (or seed DB)
    const count = await Snippet.countDocuments({ language });
    if (count === 0) {
        // Fallback static
        return res.json({ 
            code: `// Database empty for ${language}\n// Please seed database.\nconsole.log("Hello");`, 
            language 
        });
    }
    const random = Math.floor(Math.random() * count);
    const snippet = await Snippet.findOne({ language }).skip(random);
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save Result
// Save Result
app.post('/api/results', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const result = await Result.create({
      ...req.body,
      userId: decoded.id
    });

    res.json(result);

  } catch (err) {
    // ✅ If duplicate entry (same userId + wpm + accuracy + mistakes)
    if (err.code === 11000) {
      return res.status(200).json({ message: "Result already exists. Not saved again." });
    }

    res.status(500).json({ error: err.message });
  }
});

// Update XP
app.post('/api/users/xp', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);
        user.xp += req.body.xp;
        user.level = Math.floor(user.xp / 1000) + 1;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Aggregate top results
    const results = await Result.find().sort({ wpm: -1 }).limit(10).populate('userId', 'name');
    const leaderboard = results.map((r, i) => ({
      rank: i + 1,
      name: r.userId ? r.userId.name : 'Unknown',
      wpm: r.wpm,
      accuracy: r.accuracy,
      language: r.language,
      date: r.date
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Seed Route (Dev only) ---
app.post('/api/seed', async (req, res) => {
    // Add some default snippets
    await Snippet.create([
        { language: 'JavaScript', code: 'function hello() {\n  console.log("world");\n}' },
        { language: 'Python', code: 'def hello():\n    print("world")' }
    ]);
    res.json({ message: 'Database seeded' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
