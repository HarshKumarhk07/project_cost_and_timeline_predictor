exports.uploadSingle = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file' });
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename });
    } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
