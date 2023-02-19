import { Controller, Post, Req, Res, Get, Param, Put, Body, Delete } from '@nestjs/common';

import { Request, Response } from 'express';
import { CreateUserDto } from 'src/db/dto/create-user.dto';
import { UpdateUserDto } from 'src/db/dto/update-user.dto';

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

  // db R/W test endpoints

  @Get('dbtestUser')
  async index() {
    return await this.authService.findAll();
  }

  @Get('dbtestUser/:id')
  async find(@Param('id') id: string) {
    return await this.authService.findOne(id);
  }

  @Post('dbtestUser')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  // @Put('dbtestUser/:id')
  // async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return await this.authService.update(id, updateUserDto);
  // }

  // @Delete('dbtestUser/:id')
  // async delete(@Param('id') id: string) {
  //   return await this.authService.delete(id);
  // }
}
