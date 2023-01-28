import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from 'src/helpers/swagger/not-found.swagger';
import { CurrentUser } from '../users/decorator/user.decorator';
import { User } from '../users/entity/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import ShowTodoSwagger from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { TodoService } from './todo.service';

@ApiSecurity('bearer')
@Controller('api/v1/todos')
@ApiTags('todos')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({
    summary: 'List all tasks from all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: IndexTodoSwagger,
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    description: 'New task successfully created',
  })
  @Get()
  async index() {
    return await this.todoService.findAll();
  }

  @ApiOperation({
    summary: 'Add a new task for the logged in user',
  })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  @Post()
  async create(@Body() body: CreateTodoDto, @CurrentUser() user: User) {
    return await this.todoService.create(body, user);
  }

  @ApiOperation({
    summary: 'Show data of a single task',
  })
  @ApiResponse({
    status: 200,
    description: 'Task data successfully returned',
    type: ShowTodoSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update data of a task if you are owner of the task or admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
    @CurrentUser() user: User,
  ) {
    return await this.todoService.update(id, body, user);
  }

  @ApiOperation({
    summary: 'Remove a task',
  })
  @ApiResponse({
    status: 204,
    description: 'Task successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: NotFoundSwagger,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
