// Create a new file server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Simple database using JSON file
const DB_FILE = 'messages.json';

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ messages: [] }));
}

// Routes
app.get('/messages', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data.messages);
});

app.post('/messages', (req, res) => {
    const { name, text } = req.body;
    
    if (!name || !text) {
        return res.status(400).json({ error: 'Name and text are required' });
    }
    
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    const newMessage = {
        id: Date.now(),
        name,
        text,
        date: new Date().toISOString()
    };
    
    data.messages.push(newMessage);
    fs.writeFileSync(DB_FILE, JSON.stringify(data));
    
    res.status(201).json(newMessage);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});