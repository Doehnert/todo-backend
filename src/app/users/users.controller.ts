import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { isArray } from 'class-validator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles/role.enum';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found.swagger';
import { CurrentUser } from './decorator/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { IndexUserSwagger } from './swagger/index-user.swagger';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { UpdateUserSwagger } from './swagger/update-user.swagger';
import { UsersService } from './users.service';

@Controller('auth')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign up a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed in',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  @ApiOperation({
    summary: 'Get a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'All users returned successfully',
    type: IndexUserSwagger,
    isArray: true,
  })
  findAllUsers() {
    return this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  @ApiOperation({
    summary: 'Retrieve a specific user by his id',
  })
  @ApiResponse({
    status: 200,
    description: 'Specific user returned',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  findUser(@Param('id', new ParseUUIDPipe()) id: string) {
    console.log(
      '🚀 ~ file: users.controller.ts:81 ~ UsersController ~ findUser ~ id',
      id,
    );
    return this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Retrieve all users with a specific e-mail',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users with some e-mail returned',
    type: IndexUserSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'No user found with that e-mail',
    type: NotFoundSwagger,
  })
  @Get('/email')
  findAllUsersWithEmail(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Remove a user by its id',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User successfully deleted',
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No user found with that e-mail',
    type: NotFoundSwagger,
  })
  removeUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiSecurity('bearer')
  @ApiOperation({
    summary: 'Update a user by its id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a given user',
    type: UpdateUserSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  @Patch('/:id')
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }
}
