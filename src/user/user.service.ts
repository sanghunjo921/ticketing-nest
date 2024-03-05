import { Injectable } from '@nestjs/common';
import {} from './dto/req.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserResDto, UsersResDto } from './dto/res.dto';

@Injectable()
export class UserService {
  async findAll(page: number, size: number): Promise<UsersResDto> {
    console.log({
      page: typeof page,
      size: typeof size,
    });
    return {
      users: [
        {
          id: uuidv4(),
          email: 'test@test.com',
        },
        {
          id: uuidv4(),
          email: 'test@test.com',
        },
      ],
    };
  }

  async findOne(id: string): Promise<UserResDto> {
    console.log({ id });
    return {
      id: uuidv4(),
      email: 'test@test.com',
    };
  }
}

//query <-> param: param은 url에 포함되지만 query는 ?로 들어감. ex)
