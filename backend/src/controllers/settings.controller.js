let SETTINGS = {
  theme: "dark-glass",
  currency: "INR"
};

exports.getSettings = (req, res) => {
  res.json({ settings: SETTINGS });
};

exports.updateSettings = (req, res) => {
  SETTINGS = { ...SETTINGS, ...req.body };
  res.json({ settings: SETTINGS });
};
