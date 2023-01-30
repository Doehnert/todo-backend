import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/app/users/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from './roles/role.enum';

const validUser = new User({
  id: 'user_id1',
  email: 'user1@mail.com',
  password: 'hashed_password',
  roles: Role.User,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});

const inValidUser = new User({
  id: 'user_id1',
  email: 'user1@mail.com',
  password: 'wrong_password',
  roles: Role.User,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});

const validToken = {
  token: 'valid_token',
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(validToken),
            validateUser: jest.fn().mockResolvedValue(validUser),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid token if correct login credentials are given', () => {
      // Arrange
      const req: any = {
        user: validUser,
      };

      // Act
      const result = authController.login(req);

      // Assert
      expect(result).toEqual(validToken);
    });
  });
});
