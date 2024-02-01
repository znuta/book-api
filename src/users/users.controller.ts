/**
 * UsersController handles user-related HTTP requests, such as sign-up, sign-in, and profile retrieval.
 *
 * @class UsersController
 * @exports UsersController - Controller for handling user-related requests
 * @author Toyeeb  Atunde
 */
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthCredentialsDto } from './dto/auth-credentials.dto/auth-credentials.dto';
import { User } from './entities/user.entity/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import {
  ErrorResponse,
  createResponseInstance,
} from '../common/response/custom-response';
import { BadRequestError } from '../common/response/bad-request-error';
import { OkSuccessResponse } from '../common/response/ok-success ';
import { CreatedSuccessResponse } from '../common/response/created-success';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Handles the HTTP POST request for user sign-up.
   * @method signUp
   * @param {AuthCredentialsDto} authCredentialsDto - DTO containing user authentication credentials
   * @returns {Promise<User>} - The newly created user
   */
  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<CreatedSuccessResponse | ErrorResponse> {
    try {
      const registeredUser =
        await this.usersService.createUser(authCredentialsDto);

      return createResponseInstance(CreatedSuccessResponse, {
        message: 'Registration successful',
        data: registeredUser,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Handles the HTTP POST request for user sign-in.
   * @method signIn
   * @param {Request} req - Express request object
   * @returns {Promise<OkSuccessResponse | ErrorResponse>} - The signed-in user wrapped in a success response or an error response
   */
  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(
    @Req() req: Request,
  ): Promise<OkSuccessResponse | ErrorResponse> {
    try {
      const signedInUser = req.user as User;
      return createResponseInstance(OkSuccessResponse, {
        message: 'Sign-in successful',
        data: signedInUser,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }

  /**
   * Handles the HTTP GET request for user profile retrieval.
   * @method getProfile
   * @param {User} user - The authenticated user (obtained through the @GetUser() decorator)
   * @returns {Promise<OkSuccessResponse | ErrorResponse>} - The user's profile information wrapped in a success response or an error response
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @GetUser() user: User,
  ): Promise<OkSuccessResponse | ErrorResponse> {
    try {
      return createResponseInstance(OkSuccessResponse, {
        message: 'Profile retrieved successfully',
        data: user,
        success: true,
      });
    } catch (error) {
      throw new BadRequestError(error.message, error.statusCode);
    }
  }
}
