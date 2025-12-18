// lightweight settings handler (you can replace with DB-backed later)
let APP_SETTINGS = {
    theme: 'glass-orange',
    currency: 'INR',
    locale: 'en-IN'
};

exports.getSettings = async (req, res) => {
    res.json({ settings: APP_SETTINGS });
};

exports.updateSettings = async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    APP_SETTINGS = { ...APP_SETTINGS, ...req.body };
    res.json({ settings: APP_SETTINGS });
};
