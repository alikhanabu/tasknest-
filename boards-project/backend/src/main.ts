import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('cookie-parser')());

  app.enableCors({
    origin: ['http://localhost:8000', 'https://tasknest-56zy.vercel.app'],
    credentials: true,
  });

  await app.init();
  return app;
}

let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  const httpAdapter = cachedApp.getHttpAdapter();
  httpAdapter.getInstance()(req, res);
}

bootstrap();
