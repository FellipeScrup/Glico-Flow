// controllers/userController.js
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/tokenUtils');

exports.signup = async (req, res) => {
    console.log('Request Body:', req.body);
    try {
        const { email, password, termsAccepted, newsletter } = req.body;

        // Check if required fields are present
        if (!email || !password || termsAccepted === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user
        const user = new User({ email, password, termsAccepted, newsletter });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({ message: 'User created successfully', user, token });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update user data
exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // Use ID from token
        const updatedData = req.body;

        // Update user data
        const user = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User data updated successfully', user });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};