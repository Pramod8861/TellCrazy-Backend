const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5500;

const mongoURI = 'mongodb://localhost:27017/jarvis';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('❌ MongoDB error:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Schema + Model
const interactionSchema = new mongoose.Schema({
    speaker: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

// Save interaction
app.post('/interactions', async (req, res) => {
    const { speaker, message } = req.body;
    const interaction = new Interaction({ speaker, message });
    try {
        await interaction.save();
        res.status(201).json(interaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all interactions
app.get('/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.find().sort({ timestamp: -1 });
        res.json(interactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
