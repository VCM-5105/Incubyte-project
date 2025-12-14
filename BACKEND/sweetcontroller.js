const pool = require('../config/db');
 
// Get All Sweets (with search)
exports.getSweets = async (req, res) => {
    const { search } = req.query;
    let query = 'SELECT * FROM sweets';
    let params = [];
 
    if (search) {
        query += ' WHERE name LIKE ? OR category LIKE ?';
        params = [`%${search}%`, `%${search}%`];
    }
 
    try {
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sweets' });
    }
};
 
// Purchase Sweet (Decrease Stock)
exports.purchaseSweet = async (req, res) => {
    const { id } = req.params;
    
    // Start Transaction to prevent race conditions
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
 
        const [rows] = await connection.execute('SELECT stock, name FROM sweets WHERE id = ? FOR UPDATE', [id]);
        
        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Sweet not found' });
        }
 
        const sweet = rows[0];
        if (sweet.stock <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Out of stock' });
        }
 
        await connection.execute('UPDATE sweets SET stock = stock - 1 WHERE id = ?', [id]);
        await connection.commit();
        
        res.json({ message: `Purchased ${sweet.name}`, newStock: sweet.stock - 1 });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Purchase failed', error: error.message });
    } finally {
        connection.release();
    }
};
 
// Admin: Add Sweet
exports.addSweet = async (req, res) => {
    const { name, category, price, stock } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO sweets (name, category, price, stock) VALUES (?, ?, ?, ?)',
            [name, category, price, stock]
        );
        res.status(201).json({ id: result.insertId, name, stock });
    } catch (error) {
        res.status(500).json({ message: 'Error adding sweet' });
    }
};