import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
// import * as dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config'; // Using dotenv/config to automatically load environment variables

async function bootstrap() {
  // create nestjs application instance
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  // CORS doesn't apply to server requests or tools like Postman
  // But it does apply to browser requests
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    // allows cookies/auth headers in cross-origin requests
    credentials: true,
  });

  // app.use() is for registering middleware functions:
  // Enable cookie parser
  app.use(cookieParser());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
