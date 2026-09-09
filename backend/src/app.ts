import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import challanRoutes from './routes/challan.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: "Mini ERP API is running perfectly!" });
});
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", service: "mini-erp-api" });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling
app.use(errorHandler);

export default app;
