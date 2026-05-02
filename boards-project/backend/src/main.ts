import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:8000', 'https://tasknest-56zy.vercel.app'],
    credentials: true,
  });
  await app.init();
}

bootstrap();

export default server;
