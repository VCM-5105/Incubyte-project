const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sweetRoutes = require('./routes/sweetRoutes');
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors());
app.use(express.json());
 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
 
// Health Check
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running...');
});
 
// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
 
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
 
module.exports = app; // For testing