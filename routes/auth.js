const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// User Model (Assume a User schema is defined in './models/User')
const User = require("../models/User");

// Register Route
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate user input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user in the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
         
        console.log('JWT_SECRET in register:', process.env.JWT_SECRET);

        // Respond with success and the token
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error in register route:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token as response
        res.json({ token });

    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;














