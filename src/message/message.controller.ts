import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  send(@Req() request: Request, @Res() response: Response): void {
    this.messageService.sendMessage(request, response);
  }

  @Get('fetch')
  fetch(@Req() request: Request, @Res() response: Response): void {
    this.messageService.fetchMessages(request, response);
  }
}
