import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Jacaridade API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
