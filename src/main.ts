import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: (origin, callback) => {
  //     const allowedOrigins = [
  //       'http://localhost:3000', // Local development
  //       'https://yourproductiondomain.com', // Production domain
  //       'http://localhost:8081',
  //     ];

  //     if (!origin || allowedOrigins.includes(origin)) {
  //       callback(null, true); // Allow the request
  //     } else {
  //       callback(new Error('Not allowed by CORS')); // Block the request
  //     }
  //   },
  //   credentials: true, // Allows sending cookies with requests
  // });
  app.enableCors({
    origin: true, // Allows all origins
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
