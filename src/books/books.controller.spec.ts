import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../users/guard/jwt-auth.guard';
import { Book } from './entities/book.entity/book.entity';
import { User } from '../users/entities/user.entity/user.entity';
import { BookDto } from './dto/book.dto/book.dto';
import { BadRequestError } from '../common/response/bad-request-error';
import { CreatedSuccessResponse } from '../common/response/created-success';
import { OkSuccessResponse } from '../common/response/ok-success ';

describe('BooksController', () => {
  let booksController: BooksController;
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    booksController = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books: Book[] = []; // Set up your expected return data
      (booksService.findAll as jest.Mock).mockResolvedValue(books);

      const result = await booksController.findAll();
      expect(result).toBeInstanceOf(OkSuccessResponse);
      expect((result as OkSuccessResponse).serializedData().data).toEqual(
        books,
      );
    });

    it('should handle errors and return BadRequestError', async () => {
      const errorMessage = 'Test error';
      (booksService.findAll as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 400,
      });

      await expect(booksController.findAll()).rejects.toThrow(
        new BadRequestError(errorMessage, 400),
      );
    });
  });

  describe('findOne', () => {
    it('should return a book by ID', async () => {
      const bookId = 1;
      const book: Book = {} as Book; // Set up your expected return data
      (booksService.findOne as jest.Mock).mockResolvedValue(book);

      const result = await booksController.findOne(bookId.toString());
      expect(result).toBeInstanceOf(OkSuccessResponse);
      expect((result as OkSuccessResponse).serializedData().data).toEqual(book);
    });

    it('should handle errors and return BadRequestError', async () => {
      const bookId = 1;
      const errorMessage = 'Test error';
      (booksService.findOne as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 400,
      });

      await expect(booksController.findOne(bookId.toString())).rejects.toThrow(
        new BadRequestError(errorMessage, 400),
      );
    });
  });

  describe('create', () => {
    it('should create a new book and return CreatedSuccessResponse', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookData: BookDto = { title: 'Test Book', text: 'Book content' };
      const newBook: Book = { id: 1, ...bookData, author: user } as Book;
      (booksService.create as jest.Mock).mockResolvedValue(newBook);

      const result = await booksController.create(bookData, user);
      expect(result).toBeInstanceOf(CreatedSuccessResponse);
      expect((result as CreatedSuccessResponse).serializedData().data).toEqual(
        newBook,
      );
    });

    it('should handle errors and return BadRequestError', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookData: BookDto = { title: 'Test Book', text: 'Book content' };
      const errorMessage = 'Test error';
      (booksService.create as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 400,
      });

      await expect(booksController.create(bookData, user)).rejects.toThrow(
        new BadRequestError(errorMessage, 400),
      );
    });
  });

  describe('update', () => {
    it('should update an existing book and return OkSuccessResponse', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookId = 1;
      const updatedBookData: BookDto = {
        title: 'Updated Book',
        text: 'Updated content',
      };
      const updatedBook: Book = {
        id: bookId,
        ...updatedBookData,
        author: user,
      } as Book;
      (booksService.update as jest.Mock).mockResolvedValue(updatedBook);

      const result = await booksController.update(
        bookId.toString(),
        updatedBookData,
        user,
      );
      expect(result).toBeInstanceOf(OkSuccessResponse);
      expect((result as OkSuccessResponse).serializedData().data).toEqual(
        updatedBook,
      );
    });

    it('should handle errors and return BadRequestError', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookId = 1;
      const updatedBookData: BookDto = {
        title: 'Updated Book',
        text: 'Updated content',
      };
      const errorMessage = 'Test error';
      (booksService.update as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 400,
      });

      await expect(
        booksController.update(bookId.toString(), updatedBookData, user),
      ).rejects.toThrow(new BadRequestError(errorMessage, 400));
    });
  });

  describe('remove', () => {
    it('should remove an existing book and return OkSuccessResponse', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookId = 1;
      (booksService.remove as jest.Mock).mockResolvedValue({});

      const result = await booksController.remove(bookId.toString(), user);
      expect(result).toBeInstanceOf(OkSuccessResponse);
    });

    it('should handle errors and return BadRequestError', async () => {
      const user: User = { id: 1, username: 'testUser' } as User;
      const bookId = 1;
      const errorMessage = 'Test error';
      (booksService.remove as jest.Mock).mockRejectedValue({
        message: errorMessage,
        statusCode: 400,
      });

      await expect(
        booksController.remove(bookId.toString(), user),
      ).rejects.toThrow(new BadRequestError(errorMessage, 400));
    });
  });
});
