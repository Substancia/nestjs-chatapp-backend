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
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from './db/schemas/user.schema'

// TODO: move this to a .env file 
const MONGO_URL = 'mongodb://localhost/';
const MONGO_DB = 'nestjs-chatapp';

@Module({
  imports: [
    // TODO: move JWT secret to a .env file
    JwtModule.register({ secret: process.env.JWT_SECRET || 'jwt_secret' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(MONGO_URL+MONGO_DB),
    // TODO: It's possible to move this line to the corresponding submodule which deals with the specific logic. Currently we have one module - App module for handling everything
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
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
