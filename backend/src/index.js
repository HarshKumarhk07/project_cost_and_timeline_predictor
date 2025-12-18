require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads folder (make sure folder exists)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// mount routes (keep even if route files are placeholders)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/settings', settingsRoutes);

const predictRoutes = require('./routes/predict.routes');
const predictHistoryRoutes = require('./routes/predictHistory');
const adminRoutes = require('./routes/admin.routes');

app.use('/predict', predictRoutes);
app.use('/predict', predictHistoryRoutes);
app.use('/admin', adminRoutes);

// simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// centralized error handler (basic)
app.use((err, req, res, next) => {
    console.error(err);
    const code = err.status || 500;
    res.status(code).json({ message: err.message || 'Server error' });
});

// export app so server.js can start it
module.exports = app;
