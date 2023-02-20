import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { Request, Response } from 'express';
import { User, UserDocument } from 'src/db/schemas/user.schema';
import { CreateUserDto } from 'src/db/dto/create-user.dto';
import { UpdateUserDto } from 'src/db/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
  @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async generateAuth(req: Request, res: Response): Promise<void> {
    if (req.body && req.body.username && req.body.password) {
      const { username, password } = req.body;
      const userObj = await this.getUser(username);
      console.log('User fetched!', userObj);
      
      if (userObj && userObj.password === password) {
        const accessToken = this.jwtService.sign({username:userObj.username}, {
          // algorithm: 'RS256',
          expiresIn: 3600,
        });

        console.log('Authenticated', userObj.username);
        res.json({
          authStatus: true,
          description: 'Authentication successful!',
          accessToken,
        });
        return;
      }
    }

    res.status(401).json({
      authStatus: false,
      description: "I don't know you.",
    });
    return;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const userObj = await this.getUser(req.body.username);

    if (!userObj) {
      const userCount = await this.getTotalUsers();
      console.log('Total no. of users (before signup) : ',userCount )
      
      await this.addUser({
        userId: userCount,
        username: req.body.username,
        password: req.body.password,
      })
      console.log('Added user : ', req.body.username)

      res.json({
        status: 'success',
      });
      return;
    } else {
      console.log('Signup attempt failed because user exists : ', userObj.username)
    }

    res.status(400).json({ message: 'failed' });
    return;
  }

  async getUser(user: string):Promise<User>{
    return await this.model.findOne({username:user}).exec()
  }

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    return await new this.model({
      ...createUserDto
    }).save();
  }

  async getTotalUsers():Promise<number>{
    return await this.model.countDocuments().exec()
  }

  //dbtest functions

  // async findAll(): Promise<User[]> {
  //   return await this.model.find().exec();
  // }

  // async findOne(id: string): Promise<User> {
  //   return await this.model.findById(id).exec();
  // }

  // async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
  // }

  // async delete(id: string): Promise<User> {
  //   return await this.model.findByIdAndDelete(id).exec();
  // }

  
}
