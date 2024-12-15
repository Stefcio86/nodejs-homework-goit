const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
const User = require('../../models/user');
const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/upload');
const { signupSchema, loginSchema, emailSchema } = require('../../models/validation');
const { sendVerificationEmail } = require('../../services/email');

const router = express.Router();
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../../public/avatars');


router.post('/signup', async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const avatarURL = gravatar.url(email, { s: '250', d: 'retro' }, true);
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.verify) {
      return res.status(401).json({ message: 'Email or password is wrong or email not verified' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/logout', auth, async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/current', auth, async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/verify/:verificationToken', async (req, res) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verificationToken: null, verify: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/verify', async (req, res) => {
    try {
      console.log('Request body:', req.body); 
      console.log('Email schema:', emailSchema); 
  
      const { error } = emailSchema.validate(req.body);
      if (error) {
        console.error('Validation error:', error.details);
        return res.status(400).json({ message: 'missing required field email' });
      }
  
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.verify) {
        return res.status(400).json({ message: 'Verification has already been passed' });
      }
  
      await sendVerificationEmail(email, user.verificationToken);
  
      res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
      console.error('Error in /verify:', error.message);
      res.status(500).json({ message: error.message });
    }
  });


router.patch('/avatars', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path: tempPath, originalname } = req.file;
    const { _id } = req.user;

    const filename = `${_id}-${Date.now()}-${originalname}`;
    const resultPath = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(resultPath);

    await fs.unlink(tempPath);

    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
