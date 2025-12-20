const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, loginCount: 1 });
    const token = signToken(user._id);
    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name }, token });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.password) return res.status(400).json({ message: 'Use social login' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    const token = signToken(user._id);
    res.json({ success: true, user: { id: user._id, email: user.email, name: user.name, loginCount: user.loginCount }, token });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};



exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};
