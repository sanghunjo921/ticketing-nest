import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt.service';
import { JWT_HEADER } from './jwt.type';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log({ header: req.headers });
    if (JWT_HEADER in req.headers) {
      const token = req.headers[JWT_HEADER];
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && 'id' in decoded) {
        try {
          const user = await this.userService.findOne(decoded['id']);
          console.log({ user });
          req['user'] = user;
        } catch (error) {
          console.error(error);
        }
      }
    }

    next();
  }
}
