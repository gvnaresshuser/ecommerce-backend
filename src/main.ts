import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const configService = app.get(ConfigService);
  console.log('FRONTEND_URL:', configService.get('FRONTEND_URL'));
  //-------------------------- DEVELOPMENT -------------------------
  /*  app.enableCors({
     origin: "http://localhost:5173", // your Vite app
     credentials: true,
   }); */
  //-------------------------- DEVELOPMENT -------------------------
  //-------------------------- PRODUCTION -------------------------
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),// your Vite app
    credentials: true,
  });
  //-------------------------- PRODUCTION -------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  //await app.listen(process.env.PORT ?? 3000);
  //use this for production
  console.log(process.env.PORT);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
/*
🔥 Alternative (Quick way without ConfigModule)

If you want simple (not recommended for large apps):

app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
*/