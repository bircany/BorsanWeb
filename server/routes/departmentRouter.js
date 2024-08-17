import express from 'express';
import sql from 'mssql';
import { dbConfig } from "../dbConfig.js";

const router = express.Router();
router.get('/', async (req, res) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM [dbo].[Departments]');
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching departments:', err.message);
      res.status(500).json({ message: 'Error fetching departments', error: err.message });
    }
  });
export default router;
