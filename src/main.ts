import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

class MicroApplication {
  static instance: MicroApplication;
  private logger = new Logger('TripDiary - User');
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;
  private USE_AUTH: string;

  constructor(private server: NestExpressApplication) {
    if (MicroApplication.instance) return MicroApplication.instance;
    this.server = server;

    if (
      process.env.ADMIN_PAGE_PREFIX &&
      (process.env.ADMIN_PAGE_PREFIX === '' ||
        process.env.ADMIN_PAGE_PREFIX === '/')
    ) {
      this.logger.error('Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
      throw new Error('🆘 Set "ADMIN_PAGE_PREFIX" not to be empty and [/]');
    }

    if (!process.env.JWT_SECRET) this.logger.error('Set "JWT_SECRET" env');

    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '3081';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];

    MicroApplication.instance = this;
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });

    this.logger.log('Setting ValidationPipe...');
    this.server.useGlobalPipes(new ValidationPipe({ transform: true }));

    this.logger.log('Setting Logger Middleware...');

    //* Set Global Guard
    // this.server.useGlobalGuards(new SelectableJwtAuthGuard(new Reflector()));

    this.logger.log('Setting Global Interceptors...');

    // this.server.useGlobalInterceptors(new SuccessInterceptor());
    // this.logger.log('✅ SuccessInterceptor Ok');

    // this.logger.log('Setting Global Filters...');
    // this.server.useGlobalFilters(new HttpExceptionFilter());
    // this.logger.log('✅ HttpExceptionFilter Ok');
  }

  async boostrap() {
    this.logger.log('Setting Global Middleware...');
    await this.setUpGlobalMiddleware();
    this.logger.log('✅ SetUpGlobalMiddleware Ok');
    this.server.connectMicroservice({
      transport: Transport.TCP,
      options: {
        port: this.PORT,
      },
    });
    this.server.connectMicroservice({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
    await this.server.startAllMicroservices();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  // const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new MicroApplication(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
