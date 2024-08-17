import express from 'express';
import sql from 'mssql';
import { dbConfig } from '../dbConfig.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Notifications ORDER BY CreatedAt DESC');
        console.log('Data:', result.recordset); // Log verilerini kontrol et
        res.json(result.recordset);
    } catch (err) {
        console.error('Database error:', err); // Hata mesajını kontrol et
        res.status(500).send('Server error');
    }
});

export default router;
