// routes/userRoutes.js
const express = require('express');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();
const { signup, updateUser, signin } = require('../controllers/userController');

router.post('/signup', signup);
router.put('/update', protect, updateUser);
router.post('/signin', signin); // Add this for login


module.exports = router;
