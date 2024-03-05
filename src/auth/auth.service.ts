import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SigninResDto, SignupResDto } from './dto/res.dto';

@Injectable()
export class AuthService {
  async signIn(email: string, password: string): Promise<SigninResDto> {
    console.log({ email, password });
    return {
      id: uuidv4(),
    };
  }

  async signUp(email: string, password: string): Promise<SignupResDto> {
    console.log({ email, password });
    return {
      id: uuidv4(),
    };
  }
}
