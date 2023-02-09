import { Controller, Post, Req, Res } from '@nestjs/common';

import { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Req() request: Request, @Res() response: Response): void {
    this.authService.generateAuth(request, response);
  }

  @Post('signup')
  signup(@Req() request: Request, @Res() response: Response): void {
    this.authService.createUser(request, response);
  }
}
