const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const exhibitRoutes = require('./routes/exhibits');
app.use('/api/exhibits', exhibitRoutes);

