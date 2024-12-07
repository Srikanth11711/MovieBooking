

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing

// Initialize app and middleware
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add support for JSON-encoded bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://ramavathsrikanth20:googleaccount@cluster0.et0gv.mongodb.net/', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Define a schema for users
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create a model for users
const User = mongoose.model('User', userSchema);

// Define a schema for contacts (missing in the original code)
const contactSchema = new mongoose.Schema({
    email: { type: String, required: true },
    concern: { type: String, required: true },
});

// Create a model for contacts
const Contact = mongoose.model('Contact', contactSchema);

// Serve the Home Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ success: true, message: 'You are signed up successfully!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while signing up.' });
    }
});

// Contact Route
app.post('/contact', async (req, res) => {
    const { email, concern } = req.body;

    if (!email || !concern) {
        return res.status(400).json({ message: 'Email and concern are required.' });
    }

    try {
        const newContact = new Contact({ email, concern });
        await newContact.save();
        res.status(200).json({ message: 'Issue submitted successfully!' });
    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ message: 'Error saving to database.' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).send('Login Successful!');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});
// Define a schema for tickets
const ticketSchema = new mongoose.Schema({
    email: { type: String, required: true },
    movieTitle: { type: String, required: true },
    ticketCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    selectedSeats: { type: [String], required: true },
    bookingDateTime: { type: String, required: true },
});

// Create a model for tickets
const Ticket = mongoose.model('Ticket', ticketSchema);

// Ticket Booking Route
app.post('/bookticket', async (req, res) => {
    const { email, movieTitle, ticketCount, totalAmount, selectedSeats, bookingDateTime } = req.body;

    if (!email || !movieTitle || !ticketCount || !totalAmount || !selectedSeats || !bookingDateTime) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const newTicket = new Ticket({
            email,
            movieTitle,
            ticketCount: parsedTicketCount,
            totalAmount: parsedTotalAmount,
            selectedSeats,
            bookingDateTime,
        });

        await newTicket.save();
        res.status(201).json({ success: true, message: 'Ticket booked successfully!' });
    } catch (error) {
        console.error('Error saving ticket:', error);
        res.status(500).json({ success: false, message: 'Failed to save ticket.' });
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
