const express = require('express');
const cors = require('cors');
const path = require('path');
const routeRoutes = require('./routes/routeRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files if needed

// API Routes
app.use('/api/routes', routeRoutes);

// Global Error Handling Middleware
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
