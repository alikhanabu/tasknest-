import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: ['http://localhost:8000', 'https://tasknest-56zy.vercel.app'],
      credentials: true,
    });
    await app.init();
  }
  return app;
}

bootstrap();

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance()(req, res);
}
