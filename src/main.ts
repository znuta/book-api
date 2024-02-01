// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const usersService = app.get(UsersService);
  await usersService.createRootAdmin();

  await app.listen(3000);
}

bootstrap();
