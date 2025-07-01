import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/openapi/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);

  // WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // ValidationPipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
