// middlewares/validateSignup.js
module.exports = (req, res, next) => {
    const { email, password, termsAccepted } = req.body;
    if (!email || !password || !termsAccepted) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
};
