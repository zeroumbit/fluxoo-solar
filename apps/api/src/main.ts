import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  // Configuração Log Estruturado (Observabilidade - Regra 3)
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ms }) => {
            return `${timestamp} [${level}] ${message} ${ms}`;
          }),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, { logger });

  // Segurança (Hardening - Regra 6)
  app.use(helmet());
  app.use(morgan('combined')); // Logs HTTP

  // CORS restrito (Regra 6)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Fluxoo Solar API em Produção na porta ${port}`, 'Bootstrap');
}
bootstrap();
