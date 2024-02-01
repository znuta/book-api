/**
 * BooksController is responsible for handling HTTP requests related to books.
 * It integrates with the BooksService to perform various operations.
 *
 * @class BooksController
 * @exports BooksController - Controller for handling book-related HTTP requests
 * @author Toyeeb Atunde
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../users/guard/jwt-auth.guard';
import { Book } from './entities/book.entity/book.entity';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity/user.entity';
import { BookDto } from './dto/book.dto/book.dto';
import {
  ErrorObject,
  SuccessObject,
  createResponseInstance,
} from '../common/response/custom-response';
import { BadRequestError } from '../common/response/bad-request-error';
import { OkSuccessResponse } from '../common/response/ok-success ';
import { CreatedSuccessResponse } from '../common/response/created-success';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Retrieves all books.
   *
   * @method findAll
   * @returns {Promise<BadRequestError | OkSuccessResponse>} - Response containing books or error
   */
  @Get()
  async findAll(): Promise<BadRequestError | OkSuccessResponse> {
    try {
      const books = await this.booksService.findAll();
      return createResponseInstance(OkSuccessResponse, {
        message: 'Books retrieved successfully',
        data: books,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Retrieves a specific book by ID.
   *
   * @method findOne
   * @param {string} id - The ID of the book to retrieve
   * @returns {Promise<BadRequestError | OkSuccessResponse>} - Response containing the book or error
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<BadRequestError | OkSuccessResponse> {
    try {
      const book = await this.booksService.findOne(+id);
      return createResponseInstance(OkSuccessResponse, {
        message: 'Book retrieved successfully',
        data: book,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Creates a new book.
   *
   * @method create
   * @param {BookDto} bookData - The data to create the new book
   * @param {User} user - The authenticated user creating the book
   * @returns {Promise<BadRequestError | CreatedSuccessResponse>} - Response containing the new book or error
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() bookData: BookDto,
    @GetUser() user: User,
  ): Promise<BadRequestError | CreatedSuccessResponse> {
    try {
      const newBook = await this.booksService.create(bookData, user.id);

      return createResponseInstance(CreatedSuccessResponse, {
        message: 'Book created successfully',
        data: newBook,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Updates an existing book by ID.
   *
   * @method update
   * @param {string} id - The ID of the book to update
   * @param {BookDto} updatedBookData - The updated data for the book
   * @param {User} user - The authenticated user updating the book
   * @returns {Promise<BadRequestError | OkSuccessResponse>} - Response containing the updated book or error
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updatedBookData: BookDto,
    @GetUser() user: User,
  ): Promise<BadRequestError | OkSuccessResponse> {
    try {
      const updatedBook = await this.booksService.update(
        +id,
        updatedBookData,
        user.id,
      );
      return createResponseInstance(OkSuccessResponse, {
        message: 'Book updated successfully',
        data: updatedBook,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Deletes a book by ID.
   *
   * @method remove
   * @param {string} id - The ID of the book to delete
   * @param {User} user - The authenticated user deleting the book
   * @returns {Promise<BadRequestError | OkSuccessResponse>} - Response indicating success or error
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<BadRequestError | OkSuccessResponse> {
    try {
      await this.booksService.remove(+id, user.id);
      return createResponseInstance(OkSuccessResponse, {
        message: 'Book deleted successfully',
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }
}
