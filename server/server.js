import express from 'express';
import cors from 'cors';
import productRouter from './routes/productRouter.js';
import authRouter from './routes/authRouter.js';
import departmentsRouter from './routes/departmentRouter.js';
import jobRouter from './routes/jobRouter.js';
import usersRouter from './routes/usersRouter.js';
import captureRouter from './routes/captureRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import taskRouter from './routes/taskRouter.js';
import path from 'path'; 
import { fileURLToPath } from 'url'; 

const app = express();
const port = 5000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route handlers
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/users', usersRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/capture', captureRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/tasks', taskRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Yakalanmamış hata:', err);  
  res.status(500).json({ error: 'Bir şeyler ters gitti!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
