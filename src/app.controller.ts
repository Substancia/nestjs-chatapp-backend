import { Controller, Get, Post, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // TODO: move mock db seeding to a separate module
  @Post('mock-db-users')
  async postMockUsers() {
   return await this.appService.postMockUsers();
  }

  @Get()
  @Redirect('https://github.com/Substancia/nestjs-chatapp-backend')
  getHello(): string {
    return this.appService.getHello();
  }
}
