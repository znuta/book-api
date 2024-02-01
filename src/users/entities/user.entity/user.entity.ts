// src/users/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { Book } from '../../../books/entities/book.entity/book.entity';
import { Password } from '../../../users/util/password';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user', select: false })
  role: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await Password.toHash(this.password);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await Password.compare(attempt, this.password);
  }
}
