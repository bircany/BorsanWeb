import express from 'express';
import { dbConfig } from '../dbConfig.js';
import mssql from 'mssql';

const router = express.Router();

// GET: Tüm görevler
router.get('/', async (req, res) => {
    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Tasks');
        res.json(result.recordset);
    } catch (error) {
        console.error('Görevler alınırken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görevler alınırken bir hata oluştu.' });
    }
});

router.post('/', async (req, res) => {
    const { Topic, Description, AssignedToUserID, AssignedByUserID, Status, CompletedDate, AssignedDate } = req.body;

    if (!Topic || !Description || AssignedToUserID === undefined || AssignedDate === undefined) {
        console.error('Eksik alanlar:', { Topic, Description, AssignedToUserID, AssignedByUserID, Status, AssignedDate });
        return res.status(400).json({ error: 'Eksik alanlar var.' });
    }

    try {
        const pool = await mssql.connect(dbConfig);

        // Kontrol: AssignedByUserID, Users tablosunda mevcut mu?
        if (AssignedByUserID !== 0) {
            const userCheck = await pool.request()
                .input('AssignedByUserID', mssql.Int, AssignedByUserID)
                .query('SELECT COUNT(*) AS UserCount FROM Users WHERE ID = @AssignedByUserID');
                
            const { UserCount } = userCheck.recordset[0];
            
            if (UserCount === 0) {
                return res.status(400).json({ error: 'Atayan kullanıcı ID\'si geçerli değil.' });
            }
        }

        await pool.request()
            .input('Topic', mssql.NVarChar, Topic)
            .input('Description', mssql.NVarChar, Description)
            .input('AssignedToUserID', mssql.Int, AssignedToUserID)
            .input('AssignedByUserID', mssql.Int, AssignedByUserID || 0) // Varsayılan değer
            .input('Status', mssql.Bit, Status || 0)
            .input('CompletedDate', mssql.DateTime, CompletedDate || null)
            .input('AssignedDate', mssql.DateTime, AssignedDate) // AssignedDate sağlandı mı
            .query('INSERT INTO Tasks (Topic, Description, AssignedToUserID, AssignedByUserID, Status, CompletedDate, AssignedDate) VALUES (@Topic, @Description, @AssignedToUserID, @AssignedByUserID, @Status, @CompletedDate, @AssignedDate)');
        res.status(201).json({ message: 'Görev başarıyla eklendi.' });
    } catch (error) {
        console.error('Görev eklenirken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görev eklenirken bir hata oluştu.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Topic, Description, AssignedToUserID, AssignedByUserID, Status, CompletedDate } = req.body;

    // Check if required fields are present
    if (!Topic || !Description || AssignedToUserID === undefined || Status === undefined || AssignedByUserID === undefined) {
        console.error('Eksik alanlar:', { Topic, Description, AssignedToUserID, AssignedByUserID, Status, CompletedDate });
        return res.status(400).json({ error: 'Eksik alanlar var.' });
    }

    try {
        const pool = await mssql.connect(dbConfig);

        // Validate AssignedByUserID
        if (AssignedByUserID !== 0) {
            const userCheck = await pool.request()
                .input('AssignedByUserID', mssql.Int, AssignedByUserID)
                .query('SELECT COUNT(*) AS UserCount FROM Users WHERE ID = @AssignedByUserID');
                
            const { UserCount } = userCheck.recordset[0];
            
            if (UserCount === 0) {
                return res.status(400).json({ error: 'Atayan kullanıcı ID\'si geçerli değil.' });
            }
        }

        await pool.request()
            .input('ID', mssql.Int, id)
            .input('Topic', mssql.NVarChar, Topic)
            .input('Description', mssql.NVarChar, Description)
            .input('AssignedToUserID', mssql.Int, AssignedToUserID)
            .input('AssignedByUserID', mssql.Int, AssignedByUserID)
            .input('Status', mssql.Bit, Status)
            .input('CompletedDate', mssql.DateTime, CompletedDate || null)
            .query('UPDATE Tasks SET Topic = @Topic, Description = @Description, AssignedToUserID = @AssignedToUserID, AssignedByUserID = @AssignedByUserID, Status = @Status, CompletedDate = @CompletedDate WHERE ID = @ID');
        res.json({ message: 'Görev başarıyla güncellendi.' });
    } catch (error) {
        console.error('Görev güncellenirken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görev güncellenirken bir hata oluştu.' });
    }
});


// DELETE: Görev silme
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await mssql.connect(dbConfig);
        await pool.request()
            .input('ID', mssql.Int, id)
            .query('DELETE FROM Tasks WHERE ID = @ID');
        res.json({ message: 'Görev başarıyla silindi.' });
    } catch (error) {
        console.error('Görev silinirken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görev silinirken bir hata oluştu.' });
    }
});

export default router;
