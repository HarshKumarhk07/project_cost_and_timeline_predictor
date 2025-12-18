const User = require('../models/User');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Not found' });
        res.json({ user });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateUser = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updates = req.body;
        if (updates.password) delete updates.password;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
        res.json({ user });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
