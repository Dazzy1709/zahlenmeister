import connectDB from '../config/db.js';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import crypto from 'crypto'; 
import multer from 'multer';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import collection from '../config/user.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Message from '../config/messages.js';
import Levels from '../public/js/level.js';
import { questionGenerators } from '../public/shared/js/variables.js';
import { houseData } from '../public/shared/js/variables.js';
import { introDialogue } from '../public/shared/js/variables.js';
import { houseDialogue } from '../public/shared/js/variables.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: false, 
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const getDefaultUserProgress = () => ({
  completedHouses: [],
  unlockedHouses: [1, 2], 
  houseProgress: {}
});

const app = express();
connectDB();
app.set('trust proxy', 1);
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:3000' 
    : 'https://zahlenmeister.onrender.com',
  credentials: true,
  exposedHeaders: ['set-cookie'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: 'none', 
    domain: process.env.NODE_ENV === 'production' ? 'zahlenmeister.onrender.com' : undefined,
    maxAge: 24 * 60 * 60 * 1000 
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
    ttl: 24 * 60 * 60 
  })
}));

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(helmet());
app.use(compression());
app.use((req, res, next) => { const nonce = crypto.randomBytes(16).toString('hex'); res.locals.nonce = nonce; res.setHeader('Content-Security-Policy', "default-src 'self' https://zahlenmeisterr.s3.eu-central-1.amazonaws.com;script-src 'self' 'nonce-"+nonce+"' https://cdn.socket.io https://cdn.jsdelivr.net;style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;font-src 'self' https://fonts.gstatic.com data:;img-src 'self' data: https://zahlenmeisterr.s3.eu-central-1.amazonaws.com;media-src 'self' https://zahlenmeisterr.s3.eu-central-1.amazonaws.com blob:;connect-src 'self' wss://zahlenmeister.onrender.com https://cdn.socket.io;frame-src 'none';object-src 'none'"); next(); });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/profile-pictures'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.session.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (JPEG, JPG, PNG, GIF)');
    }
  }
}).single('profilePicture');

app.get ("/", (req, res) => {
  res.render("welcome", {
    introDialogue
  });
});

app.get("/home", async (req, res) => {
  const user = req.session.user;
  let userProgress = getDefaultUserProgress();
  if (user) {
    try {
      const dbUser = await collection.findById(user.id);
      if (dbUser?.progress) {
        userProgress = {
          ...dbUser.progress.toObject(),
          houseProgress: dbUser.progress.houseProgress instanceof Map 
            ? Object.fromEntries(dbUser.progress.houseProgress)
            : dbUser.progress.houseProgress
        };
      }
    } catch (e) {
      console.error('Error fetching user progress:', e);
    }
  }
  res.render('home', {
    houseId: 1,
    level: 1,
    user: user || null,
    userProgress, 
    houses: houseData.map(house => ({
      ...house,
      isLocked: !userProgress.unlockedHouses.includes(house.number),
      isCompleted: userProgress.completedHouses.includes(house.number)
    })),
    isGuest: !user,
     nonce: res.locals.nonce
  });
});
app.get ("/login", (req, res) => {
  res.render("login");
});
app.get ("/signup", (req, res) => {
  res.render("signup");
});
app.get('/rechnen/:houseId/:level',async (req, res) => {
  const { houseId, level } = req.params;
  const levelNum = parseInt(level);
  const houseIdNum = parseInt(houseId);
  const sessionUser = req.session.user;
  const house = houseData.find(h => h.number === houseIdNum);
  if (!house || levelNum < 1 || levelNum > house.levelLimit) {
      return res.redirect('/home');
  }

  let userProgress;
  if (sessionUser) {
    try {
      await collection.findOneAndUpdate(
        { _id: sessionUser.id },
        { 
          $set: { 
            [`progress.houseProgress.${houseIdNum}`]: levelNum 
          } 
        },
        { new: true }
      );
    } catch (e) {
      console.error('Error updating progress:', e);
    }
  }
  if (sessionUser) {
    try {
      const dbUser = await collection.findById(sessionUser.id);
      if (!dbUser) {
        userProgress = getDefaultUserProgress();
      } else {
        userProgress = {
          completedHouses: dbUser.completedHouses || [],
          unlockedHouses: dbUser.unlockedHouses || [1, 2, 3, 4],
          houseProgress: dbUser.houseProgress || {}
        };
      }
    } catch (e) {
      console.error('DB error:', e);
      userProgress = getDefaultUserProgress(); 
    }
  } else {
    userProgress = getDefaultUserProgress();
  }
  if (levelNum < 1 || levelNum > 15) {
    return res.redirect('/home');
  }
  if (!house) {
    return res.status(404).render('home', {
      message: `Haus mit ID ${houseId} existiert nicht`,
      redirectUrl: '/home'
    });
  }
  const validTopics = Object.keys(questionGenerators);
  const fallbackTopic = "Plus (Easy)";
  const normalizeTopic = (topic) => 
    topic.toLowerCase().replace("multiplication", "multiplikation");
  const houseTopic = validTopics.find(topic => 
    normalizeTopic(topic) === normalizeTopic(house.topic)
  ) || fallbackTopic;
  const currentLevel = new Levels(
    levelNum,
    houseTopic, 
    house.time || 15, 
    house.numberStart,
    house.numberLimit
  );

  const currentQuestion = currentLevel.generateQuestions();
  const backgroundStyle = `${house.image}`;
  res.render('rechnen', {
    houseId: houseIdNum,
    houseName: house.name,
    houseData: houseData,
    houseDescription: house.description,
    level: levelNum,
    levelLimit: house.levelLimit,
    question: currentQuestion[0].question,
    image: backgroundStyle,
    answer: currentQuestion[0].answer,
    isLastLevel: levelNum === 15,
    user: sessionUser || null,
    userProgress: userProgress,
    timeLimit: house.time || 15,
    totalLevels: 15,
    currentTopic: houseTopic,
     nonce: res.locals.nonce,
    dialogues: {
      intro: houseDialogue[houseIdNum]?.intro || [],
      outro: houseDialogue[houseIdNum]?.outro || []
    }
  });
});

app.get("/settings", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  collection.findById(req.session.user.id)
    .then(user => {
      if (user) {
        req.session.user = {
          ...req.session.user,
          profilePicture: user.profilePicture,
          name: user.name
        };
        req.session.save();
      }
      res.render("settings", {
        user: req.session.user,
        nonce: res.locals.nonce
      });
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      res.redirect('/home');
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

app.get('/session/refresh', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  req.session.touch();
  req.session.save(err => {
    if (err) {
      console.error('Session refresh error:', err);
      return res.status(500).json({ error: "Session error" });
    }
    res.json({ success: true });
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/static')) {
    return next();
  }
  if (req.session.user) {
    req.session.touch();
    req.session.save(err => {
      if (err) console.error('Session refresh error:', err);
      next();
    });
  } else {
    next();
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('connection', async (socket) => {
  socket.on('chat message', async (msgData) => {
    const { content, username } = msgData;  
    let savedMessage;

    try {
      const user = await collection.findOne({ name: username });
      const profilePicture = user?.profilePicture || 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png';

      savedMessage = await Message.create({ 
        content, 
        username,
        profilePicture
      });
    } catch (e) {
      console.error('Failed to save message:', e);
      return;
    }

    io.emit('chat message', {
      content,
      username,
      profilePicture: savedMessage.profilePicture,
      createdAt: savedMessage.createdAt,
      id: savedMessage._id
    });
  });

  const offset = socket.handshake.auth?.serverOffset;
  if (!socket.recovered) {
    try {
      let query = {};
      if (offset && mongoose.Types.ObjectId.isValid(offset)) {
        query = { _id: { $gt: new mongoose.Types.ObjectId(offset) } };
      }

      const messages = await Message.find(query).sort({ _id: 1 });
      for (const msg of messages) {
        socket.emit('chat message', {
          content: msg.content,
          username: msg.username,
          profilePicture: msg.profilePicture,
          createdAt: msg.createdAt,
          id: msg._id
        });
      }
    } catch (e) {
      console.error('Failed to recover messages:', e);
    }
  }
});

app.post('/complete-house', async (req, res) => {
  const { houseId } = req.body;
  const houseIdNum = parseInt(houseId);
  if (!req.session.user) {
    return res.json({ 
      success: true,
      guestProgress: true
    });
  }
  try {
    const nextHouse = houseIdNum + 1;
    const updateQuery = {
      $addToSet: {
        "progress.completedHouses": houseIdNum
      }
    };
    if (houseData.some(h => h.number === nextHouse)) {
      updateQuery.$addToSet["progress.unlockedHouses"] = nextHouse;
    }
    const updatedUser = await collection.findByIdAndUpdate(
      req.session.user.id,
      updateQuery,
      { new: true }
    );
    req.session.user.progress = updatedUser.progress;
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          console.error('Session save error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
    res.json({ 
      success: true,
      completedHouses: updatedUser.progress.completedHouses,
      unlockedHouses: updatedUser.progress.unlockedHouses,
      updatedProgress: updatedUser.progress
    });
  } catch (err) {
    console.error('House completion error:', err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/change-username', async (req, res) => {
  const { newUsername } = req.body;
  const userId = req.session.user?.id;
  if (!userId) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authenticated' 
    });
  }
  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({ 
      success: false, 
      error: 'Username must be at least 3 characters' 
    });
  }
  try {
    const existingUser = await collection.findOne({ name: newUsername });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already taken' 
      });
    }
    req.session.user.name = newUsername;
    req.session.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error changing username:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/upload-profile-picture', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err instanceof multer.MulterError 
          ? 'File too large (max 5MB)' 
          : 'Only images are allowed (JPEG, JPG, PNG, GIF)'
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file selected' 
      });
    }
    if (!req.session.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authenticated' 
      });
    }
    try {
      const profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
      const updatedUser = await collection.findByIdAndUpdate(
        req.session.user.id,
        { profilePicture: profilePicturePath },
        { new: true }
      );
      req.session.user.profilePicture = updatedUser.profilePicture;
      req.session.save(); 
      res.json({ 
        success: true,
        profilePicture: updatedUser.profilePicture 
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Server error' 
      });
    }
  });
});

app.post("/signup", async (req,res) => {
  const { houseId, level } = req.params;
  const levelNum = parseInt(level);
  const houseIdNum = parseInt(houseId);
  const data = {
    name: req.body.username, 
    password: req.body.password
  }
  const existingUser = await collection.findOne({name: data.name});

  if (existingUser) {
    res.render("signup", { error: "Benutzername ist bereits vergeben" })
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userdata = await collection.create({
      name: data.name,
      password: data.password,
      profilePicture: 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png',
      progress: getDefaultUserProgress() 
    });
    const sessionUser = {
      id: userdata._id, 
      name: data.name,
      profilePicture: 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png',
      progress: userdata.progress 
    };
    req.session.user = sessionUser;
    res.render("home", {
      houseId: houseIdNum || 1,
      level: levelNum || 1,
      selectedDialogueKey: "home",
      user: sessionUser,
      houses: houseData.map(house => ({
        ...house,
        isCompleted: sessionUser.progress?.completedHouses?.includes(house.number),
        isLocked: !sessionUser.progress?.unlockedHouses?.includes(house.number)
      }))
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.render("login", { error: "Benutzername und Passwort werden benötigt" });
    }

    const user = await collection.findOne({ name: req.body.username }).select('+password');
    if (!user) {
      return res.render("login", { error: "Benutzername nicht gefunden" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.render("login", { error: "Falsches Passwort" });
    }
    if (!user.progress) {
      await collection.findByIdAndUpdate(
        user._id,
        { $set: { progress: getDefaultUserProgress() } },
        { new: true }
      );
    }
    req.session.user = { 
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture || 'https://zahlenmeisterr.s3.eu-central-1.amazonaws.com/default-profile.png',
      progress: user.progress || getDefaultUserProgress()
    };
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.render("login", { error: "Login fehlgeschlagen" });
      }
      res.render("home", {
        houseId: 1,
        level: 1,
        user: req.session.user,
        houses: houseData.map(house => ({
          ...house,
          isCompleted: req.session.user.progress.completedHouses.includes(house.number),
          isLocked: !req.session.user.progress.unlockedHouses.includes(house.number)
        })),
        nonce: res.locals.nonce
      });
    });

  } catch (err) {
    console.error("Login error:", err);
    res.render("login", { error: "Ein Fehler ist aufgetreten" });
  }
});

// Error handling middleware (add this right before your app.listen)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: 'File upload error',
      details: err.message
    });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
  }
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});

