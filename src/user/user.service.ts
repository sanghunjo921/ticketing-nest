import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UpdateUserReqDto } from './dto/req.dto';
import { UserResDto, UsersResDto } from './dto/res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    return this.userRepository.find({ skip: skip, take: size });
  }

  async findOne(id: string): Promise<UserResDto> {
    console.log({ id });
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<UserResDto> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    await this.userRepository.save(user);
    return user;
  }

  async update(id: string, updateData: UpdateUserReqDto) {
    const target = await this.findOne(id);

    const { affected } = await this.userRepository.update(id, updateData);

    if (affected === 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return { ...target, ...updateData };
  }

  async delete(id: string) {
    const { affected } = await this.userRepository.delete(id);

    if (affected === 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return 'deleted';
  }
}

//query <-> param: param은 url에 포함되지만 query는 ?로 들어감. ex)
