import express from 'express';
import dotenv from 'dotenv';
import pixRoutes from './routes/pix';
import cors from 'cors';

const app = express();
app.use(express.json());
dotenv.config();


app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend Vite
  credentials: true
}));

app.use('/api', pixRoutes);
app.use('/pix', pixRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


