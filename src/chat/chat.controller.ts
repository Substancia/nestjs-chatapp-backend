import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('connect')
  connect(@Req() request: Request, @Res() response: Response): void {
    this.chatService.connectToChat(request, response);
  }

  @Post('create-group')
  create(@Req() request: Request, @Res() response: Response): void {
    this.chatService.createGroupChat(request, response);
  }

  @Post('add-to-group')
  add(@Req() request: Request, @Res() response: Response): void {
    this.chatService.addUserToGroup(request, response);
  }

  @Post('remove-from-group')
  remove(@Req() request: Request, @Res() response: Response): void {
    this.chatService.removeUserFromGroup(request, response);
  }
}
