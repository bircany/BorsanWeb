import express from 'express';
import sql from 'mssql';
import { dbConfig } from "../dbConfig.js";

const router = express.Router();
router.get('/', async (req, res) => {
    const { departmentId } = req.query;
    try {
      const pool = await sql.connect(dbConfig);
      let query = 'SELECT * FROM [dbo].[Jobs]';
      if (departmentId) {
        query += ' WHERE DepartmentID = @departmentId';
      }
      const request = pool.request();
      if (departmentId) {
        request.input('departmentId', sql.Int, departmentId);
      }
      const result = await request.query(query);
      res.json(result.recordset);
    } catch (err) {
      console.error('Error fetching departments:', err.message);
      
      res.status(500).json({ message: 'Error fetching departments', error: err.message });
    }
  });
export default router;
