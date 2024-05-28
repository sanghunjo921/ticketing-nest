import { JwtModuleOptions, JWT_CONFIG } from './jwt.type';
import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(@Inject(JWT_CONFIG) private readonly option: JwtModuleOptions) {}

  signin(id: string): string {
    return jwt.sign({ id }, this.option.privateKey);
  }

  verify(token: string) {
    return jwt.verify(token, this.option.privateKey);
  }
}
