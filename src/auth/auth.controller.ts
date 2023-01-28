import { Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BadRequestSwagger } from 'src/helpers/swagger/bad-request.swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Log in user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'E-mail or password are invalid',
    type: BadRequestSwagger,
  })
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async login(@Req() req: Request) {
    return await this.authService.login(req.user);
  }
}
