require('dotenv').config(); 
const express = require('express');
const path = require('path'); 
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes'); // Import routes

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));
app.use(express.json());
// Use the chat routes
app.use('/api', chatRoutes);
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.get('/', (req, res) => {
    res.send('Jarvis Backend is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});