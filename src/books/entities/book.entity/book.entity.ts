// src/books/entities/book.entity.ts
import { User } from '../../../users/entities/user.entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.books, { eager: true })
  author: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  readers: User[];
}
