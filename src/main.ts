import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

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
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
