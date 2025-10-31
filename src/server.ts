import App from './app';

const PORT = process.env.PORT || 3000;

const app = new App().app;

const server = app.listen(PORT, () => {
  console.log(`Notification System Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    // Additional cleanup can be done here if needed
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(async () => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default server;