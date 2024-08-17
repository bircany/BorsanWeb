import express from 'express';
import sql from 'mssql';
import { dbConfig } from "../dbConfig.js";

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    if (userData.password !== userData.confirmPassword) {
      return res.status(400).json({ message: 'Şifreler eşleşmiyor' });
    }
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('name', sql.VarChar, userData.name)
      .input('surname', sql.VarChar, userData.surname)
      .input('username', sql.VarChar, userData.username)
      .input('email', sql.VarChar, userData.email)
      .input('password', sql.VarChar, userData.password)
      .input('department', sql.Int, userData.department)
      .input('job', sql.Int, userData.job)
      .input('dbo', sql.Date, userData.dbo)
      .query(`
        INSERT INTO Users (Name, Surname, Username, Email, Password, Dbo, DepartmentID, JobID, createDate)
        VALUES (@name, @surname, @username, @email, @password, @dbo, @department, @job, GETDATE())
      `);

    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
  } catch (err) {
    console.error('Kayıt sırasında hata:', err);
    res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');
    
    const user = result.recordset[0];

    if (user) {
      if (user.password === password) {
        res.status(200).json({ 
          message: 'Giriş başarılı', 
          user: {
            name: user.name,
            surname: user.surname,
            username: user.username,
            permID: user.permID,
            createDate: user.createDate,
            password: user.password,
            jobID: user.jobID,
            email: user.email,
            dbo: user.dbo,
            DepartmentID: user.DepartmentID,
          }
        });
      } else {
        res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
      }
    } else {
      res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (err) {
    console.error('Giriş sırasında hata:', err);
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu' });
  }
});
router.get('/verify-permission/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT permID FROM Users WHERE username = @username');
    
    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.status(200).json({ permID: user.permID });
  } catch (err) {
    console.error('İzinler alınamadı:', err);
    res.status(500).json({ message: 'İzinler alınamadı' });
  }
});


export default router;
