import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import ongRoutes from './routes/ongRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import causeRoutes from './routes/causeRoutes.js';

const app = express();
const port = process.env.PORT || 3001;
const swaggerDocument = YAML.load('./swagger.yaml');
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);

app.use(cookieParser());app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ong', ongRoutes);
app.use('/api/ong/inventory', inventoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/causes', causeRoutes);

app.get('/', (req, res) => {
  res.send('Care n Share API is running');
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: 'JSON inválido no corpo da requisição.'
    });
  }

  return next(error);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI disponível em http://localhost:${port}/api-docs`);
});
