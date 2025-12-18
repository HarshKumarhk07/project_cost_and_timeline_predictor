const Prediction = require('../models/Prediction');

// GET /predict/history
// Get history for the current logged-in user
exports.getHistory = async (req, res) => {
    try {
        const predictions = await Prediction.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions
        });
    } catch (error) {
        console.error('Get History Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// GET /predict/history/:user_id
// Get history for a specific user (Admin or Self)
exports.getUserHistory = async (req, res) => {
    try {
        // Check if user is requesting their own history or is an admin
        if (req.user.id !== req.params.user_id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this history'
            });
        }

        const predictions = await Prediction.find({ user: req.params.user_id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions
        });
    } catch (error) {
        console.error('Get User History Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// DELETE /predict/history/:prediction_id
// Delete a specific prediction
exports.deletePrediction = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.prediction_id);

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        // Ensure user owns the prediction or is admin
        if (prediction.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this prediction'
            });
        }

        await prediction.deleteOne();

        return res.status(200).json({
            success: true,
            data: {},
            message: 'Prediction deleted successfully'
        });
    } catch (error) {
        console.error('Delete Prediction Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
