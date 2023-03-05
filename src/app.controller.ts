import { Controller, Get, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('https://github.com/Substancia/nestjs-chatapp-backend')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthcheck')
  healthcheck(@Res() res: Response): void {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
    res.status(200).send(healthcheck);
    return;
  }
}
