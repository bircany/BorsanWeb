import express from 'express';
import sql from 'mssql';
import { dbConfig } from '../dbConfig.js';

const router = express.Router();

// Get user profile by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    console.log(`Profil alınıyor kullanıcı adı: ${username}`);
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Profil alma hatası:', err);
    res.status(500).json({ message: 'Profil alınırken bir hata oluştu' });
  }
});

// Update user profile by username
router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { name, surname, email, password, jobID, permID, dbo, DepartmentID, createDate } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .input('name', sql.VarChar, name)
      .input('surname', sql.VarChar, surname)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .input('jobID', sql.Int, jobID)
      .input('permID', sql.Int, permID)
      .input('dbo', sql.Date, dbo)
      .input('DepartmentID', sql.Int, DepartmentID)
      .input('createDate', sql.Date, createDate)
      .query(`
        UPDATE Users 
        SET name = @name, surname = @surname, email = @email, 
            password = @password, jobID = @jobID, permID = @permID, dbo = @dbo,
            DepartmentID = @DepartmentID, createDate = @createDate
        WHERE username = @username
      `);
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({ message: 'Profil başarıyla güncellendi' });
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Profil güncellenirken bir hata oluştu' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM Users');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});
router.put('/perm/:id', async (req, res) => {
  const { id } = req.params;
  const { permID } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('permID', sql.Int, permID)
      .query('UPDATE Users SET permID = @permID WHERE ID = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({ message: 'Rol başarıyla güncellendi' });
  } catch (err) {
    console.error('Rol güncelleme hatası:', err);
    res.status(500).json({ message: 'Rol güncellenirken bir hata oluştu' });
  }
});


export default router;
