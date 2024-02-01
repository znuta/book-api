// src/books/books.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity/book.entity';
import { BookDto } from './dto/book.dto/book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Fetches all books with author and readers relations.
   * @returns A promise that resolves to an array of Book entities.
   */
  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({ relations: ['author', 'readers'] });
  }

  /**
   * Retrieves a specific book by its ID.
   * @param id - The ID of the book to retrieve.
   * @returns A promise that resolves to the found Book entity.
   * @throws `NotFoundException` if the book with the specified ID is not found.
   */
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  /**
   * Creates a new book associated with the specified author.
   * @param bookData - Data for creating a new book.
   * @param authorId - ID of the author to associate with the book.
   * @returns A promise that resolves to the created Book entity.
   * @throws `NotFoundException` if the specified author is not found.
   */
  async create(bookData: BookDto, authorId: number): Promise<Book> {
    const { title, text } = bookData;
    const author = await this.usersService.findOneById(authorId);

    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const book = this.booksRepository.create({ title, text, author });
    return this.booksRepository.save(book);
  }

  /**
   * Updates an existing book with the specified data.
   * @param id - The ID of the book to update.
   * @param updatedBookData - Data to update the book.
   * @param authorId - ID of the author attempting to update the book.
   * @returns A promise that resolves to the updated Book entity.
   * @throws `NotFoundException` if the book with the specified ID is not found.
   * @throws `ForbiddenException` if the author attempting the update is not the original author.
   */
  async update(
    id: number,
    updatedBookData: BookDto,
    authorId: number,
  ): Promise<Book> {
    const existingBook = await this.findOne(id);
    if (!existingBook)
      throw new NotFoundException(`Book with ID ${id} not found`);
    if (existingBook.authorId != authorId)
      throw new ForbiddenException(
        'You do not have permission to edit this book',
      );

    await this.booksRepository.update(id, updatedBookData);
    return this.findOne(id);
  }

  /**
   * Removes a book with the specified ID, ensuring the author has permission to delete.
   * @param id - The ID of the book to delete.
   * @param authorId - ID of the author attempting to delete the book.
   * @returns A promise that resolves to void.
   * @throws `NotFoundException` if the book with the specified ID is not found.
   * @throws `ForbiddenException` if the author attempting the deletion is not the original author.
   */
  async remove(id: number, authorId: number): Promise<void> {
    const existingBook = await this.findOne(id);
    if (!existingBook)
      throw new NotFoundException(`Book with ID ${id} not found`);
    if (existingBook.authorId != authorId)
      throw new ForbiddenException(
        'You do not have permission to delete this book',
      );
    await this.booksRepository.delete(id);
  }
}
