import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/db/schemas/user.schema';
import { Model } from 'mongoose';
import { usersList } from 'src/db/mock/usersMock';


@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>,) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async postMockUsers(){
    return await this.model.insertMany(usersList);
  }
}
