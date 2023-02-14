import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { AuthService } from './user/auth.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'jwt_secret' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    UserController,
    MessageController,
    ChatController,
  ],
  providers: [AppService, AuthService, MessageService, ChatService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MessageController);
  }
}
