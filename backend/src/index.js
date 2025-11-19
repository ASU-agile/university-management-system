const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => res.send('University Management API is running.'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
