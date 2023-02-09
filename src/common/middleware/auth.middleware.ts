import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const token = <string>req.headers['x-access-token'];
    if (!token) {
      res
        .status(403)
        .send({ message: 'A token is required for authentication' });
      return;
    }
    try {
      this.jwtService.verify(token);
    } catch (err) {
      res.status(401).send({ err });
      return;
    }

    next();
  }
}
