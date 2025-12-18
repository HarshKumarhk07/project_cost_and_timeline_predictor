const Prediction = require('../models/Prediction');
const User = require('../models/User');

// GET /admin/predictions
exports.getAllPredictions = async (req, res) => {
    try {
        const predictions = await Prediction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions
        });
    } catch (error) {
        console.error('Admin Get All Predictions Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// GET /admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Admin Get All Users Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
