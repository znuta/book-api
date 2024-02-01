/**
 * The `UsersService` class is responsible for handling user-related operations,
 * such as user creation, retrieval, and root admin initialization.
 *
 * @class
 * @exports UsersService - Service for user-related operations
 * @author Toyeeb Atunde
 */
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto/auth-credentials.dto';

@Injectable()
export class UsersService {
  /**
   * Constructor for the `UsersService` class.
   * @constructor
   * @param {Repository<User>} userRepository - The repository for interacting with the `User` entity
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user based on the provided authentication credentials.
   * @method createUser
   * @param {AuthCredentialsDto} authCredentialsDto - The authentication credentials for the new user
   * @returns {Promise<User>} - The created user
   * @throws {ConflictException} - Thrown if the username already exists
   */
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const existingUser = await this.userRepository.findOneBy({ username });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = this.userRepository.create({ username, password });
    const savedUser = this.userRepository.save(user);

    // Omit password from the response
    delete (await savedUser).password;

    return savedUser;
  }

  /**
   * Retrieves a user by their username.
   * @method findOne
   * @param {string} username - The username of the user to retrieve
   * @returns {Promise<User | undefined>} - The retrieved user or undefined if not found
   */
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ username });
  }

  /**
   * Retrieves a user by their ID.
   * @method findOneById
   * @param {number} id - The ID of the user to retrieve
   * @returns {Promise<User | undefined>} - The retrieved user or undefined if not found
   */
  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Finds a user by username, optionally including the password and role.
   * @method findByUsername
   * @param {string} username - The username of the user to retrieve
   * @param {boolean} withPassword - Whether to include the password and role in the response
   * @returns {Promise<User>} - The retrieved user
   */
  async findByUsername(
    username: string,
    withPassword: boolean = false,
  ): Promise<User> {
    const query = this.userRepository.createQueryBuilder('user');

    query.where('user.username = :username', { username });

    if (withPassword) {
      query.addSelect(['user.password', 'user.role']);
    }

    return query.getOne();
  }

  /**
   * Creates the root admin user if it doesn't exist.
   * @method createRootAdmin
   * @returns {Promise<void>} - Resolves once the root admin user is created
   */
  async createRootAdmin(): Promise<void> {
    const existingRootAdmin = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!existingRootAdmin) {
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      await this.userRepository.save(adminUser);
    }
  }
}
