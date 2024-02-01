import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto/auth-credentials.dto';
import { BadRequestError } from '../common/response/bad-request-error';
import { CreatedSuccessResponse } from '../common/response/created-success';
import { OkSuccessResponse } from '../common/response/ok-success ';
import { createResponseInstance } from '../common/response/custom-response';
import { User } from './entities/user.entity/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findOne: jest.fn(),
            findOneById: jest.fn(),
            findByUsername: jest.fn(),
            createRootAdmin: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should create a new user and return CreatedSuccessResponse', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        username: 'testuser',
        password: 'password123',
      };
      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        password: 'password123',
        role: 'user',
      } as User);

      const result = await controller.signUp(authCredentialsDto);

      expect(result.success).toEqual(true);
    });
  });
});
