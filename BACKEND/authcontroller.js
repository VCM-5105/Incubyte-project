const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 
// Register User
exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
 
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'customer']
        );
 
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};
 
// Login User
// Co-authored-by: AI Assistant <ai@example.com> (generated JWT logic)
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
 
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
 
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
 
        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
 
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};