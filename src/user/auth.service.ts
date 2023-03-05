import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request, Response } from 'express';
import { addUser, getUser } from '../db/mock/usersMock';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAuth(req: Request, res: Response): void {
    if (req.body && req.body.username && req.body.password) {
      const { username, password } = req.body;
      const userObj = getUser({ username, password });

      if (userObj) {
        const accessToken = this.jwtService.sign(userObj, {
          // algorithm: 'RS256',
          expiresIn: 3 * 24 * 3600,
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

  createUser(req: Request, res: Response): void {
    if (
      addUser({
        username: req.body.username,
        password: req.body.password,
      })
    ) {
      res.json({
        status: 'success',
      });
      return;
    }

    res.status(500).json({ message: 'failed' });
    return;
  }
}
