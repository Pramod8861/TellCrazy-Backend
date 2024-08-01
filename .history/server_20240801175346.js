const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5500;

const mongoURI = 'mongodb+srv://pramod18:pramodB18@cluster0.cny7fgt.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const interactionSchema = new mongoose.Schema({
    speaker: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

app.post('/interactions', async (req, res) => {
    const { speaker, message } = req.body;
    const interaction = new Interaction({ speaker, message });
    try {
        await interaction.save();
        res.status(201).send(interaction);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.findOne();
        res.json(interactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
