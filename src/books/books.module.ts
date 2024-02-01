import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity/book.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Book, User])],
  controllers: [BooksController],
  providers: [BooksService, UsersService],
})
export class BooksModule {}
