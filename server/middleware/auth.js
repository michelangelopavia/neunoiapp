const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        let secret = process.env.JWT_SECRET;

        if (!secret) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('JWT_SECRET is missing in production environment!');
            }
            console.warn('[AUTH-WARNING] Using fallback secret for DEVELOPMENT only.');
            secret = 'dev-secret-only';
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
