/**
 * The `AuthService` class is responsible for user authentication and JWT token generation.
 * It provides methods for validating user credentials and generating authentication tokens.
 *
 * @class
 * @exports AuthService - Service for user authentication and JWT token generation
 * @author Toyeeb Atunde
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto/auth-credentials.dto';
import { User } from './entities/user.entity/user.entity';

@Injectable()
export class AuthService {
  /**
   * Constructor for the `AuthService` class.
   * @constructor
   * @param {UsersService} usersService - The service for user-related operations
   * @param {JwtService} jwtService - The service for JWT token generation
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials and returns the user if valid.
   * @method validateUser
   * @param {AuthCredentialsDto} authCredentialsDto - The authentication credentials to validate
   * @returns {Promise<User>} - The validated user
   * @throws {UnauthorizedException} - Thrown if the credentials are invalid
   */
  async validateUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersService.findByUsername(username, true);

    if (user && (await user.comparePassword(password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Generates a JWT access token for the authenticated user.
   * @method signIn
   * @param {User} user - The authenticated user
   * @returns {Promise<{ accessToken: string }>} - The generated JWT access token
   */
  async signIn(user: User): Promise<{ accessToken: string }> {
    const payload = { id: user.id, username: user.username, role: user.role };

    // Log the payload for debugging purposes
    console.log('user', payload);

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
