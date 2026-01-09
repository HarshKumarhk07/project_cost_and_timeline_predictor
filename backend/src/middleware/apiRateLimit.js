const rateLimitPoints = new Map();

const rateLimiter = (req, res, next) => {
    // Get IP - simplified for this environment
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxReqs = 3;

    if (!rateLimitPoints.has(ip)) {
        rateLimitPoints.set(ip, { count: 1, startTime: now });
        return next();
    }

    const data = rateLimitPoints.get(ip);

    if (now - data.startTime > windowMs) {
        // Reset window
        data.count = 1;
        data.startTime = now;
        rateLimitPoints.set(ip, data);
        return next();
    }

    if (data.count >= maxReqs) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please wait a minute.'
        });
    }

    data.count++;
    rateLimitPoints.set(ip, data);
    next();
};

module.exports = rateLimiter;
