import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { cinebookRouter } from './routes/cinebook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Cinebook Movie Booking API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Cinebook API routes
app.use('/api', cinebookRouter);

// Serve frontend build in production if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="background:#0f1017;color:#f84464;font-family:sans-serif;padding:40px;text-align:center;">
            <h1>🎬 Cinebook Backend API Live</h1>
            <p style="color:#94a3b8;">Endpoints available at <a href="/api/movies" style="color:#f84464;">/api/movies</a></p>
            <p style="color:#64748b;">Frontend dev server is running on <code>http://localhost:5173</code></p>
          </body>
        </html>
      `);
    }
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🎬  Cinebook - India's Hindi Movie Booking Platform`);
  console.log(`📡  Server listening on http://0.0.0.0:${PORT}`);
  console.log(`🍿  Movies API: http://localhost:${PORT}/api/movies`);
  console.log(`🎟️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Port ${PORT}] In use by another service.`);
  } else {
    console.error(`[Port ${PORT}] Error:`, err);
  }
});
