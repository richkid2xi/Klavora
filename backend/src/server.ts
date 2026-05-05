import app from './app';
import { loadConfig } from './config';
import { connectRedis } from './libs/redis';
import prisma from './libs/prisma';
import { startLowStockScanner } from './jobs/lowStockScanner';
import { startExpiryChecker } from './jobs/expiryChecker';
import { startReportAggregator } from './jobs/reportAggregator';

const config = loadConfig();

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    // Connect to Redis
    try {
      await connectRedis();
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed, continuing without Redis...');
    }

    // Start background jobs
    if (config.NODE_ENV !== 'test') {
      startLowStockScanner();
      console.log('✅ Low stock scanner job started');
      
      startExpiryChecker();
      console.log('✅ Expiry checker job started');
      
      startReportAggregator();
      console.log('✅ Report aggregator job started');
    }

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📚 API available at ${config.API_BASE_URL}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();