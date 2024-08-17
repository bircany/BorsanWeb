import express from 'express';
import { exec } from 'child_process';

const router = express.Router();

router.post('/capture', (req, res) => {
  exec('start ms-screenclip:', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ekran alıntısı aracı başlatılamadı: ${error}`);
      return res.status(500).json({ error: 'Ekran alıntısı aracı başlatılamadı' });
    }
    res.json({ message: 'Ekran alıntısı aracı başlatıldı' });
  });
});

export default router;