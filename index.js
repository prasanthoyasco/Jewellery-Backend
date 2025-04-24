import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import goldRateRoutes from './routes/goldRateRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

dotenv.config();
const app = express();

// cors
app.use(
  cors({
    origin: [process.env.FRONTEND_DASH_URL, process.env.FRONTEND_CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
  })
);

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());

// Routes
app.use('/api/gold-rates', goldRateRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

// DB + Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
});
