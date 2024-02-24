import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/dto/req.dto';
import { FindUserReqDto } from './dto/req.dto';
import { UserResDto, UsersResDto } from './dto/res.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiExtraModels(UsersResDto, UserResDto, FindUserReqDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() { page, size }: PageReqDto): Promise<UsersResDto> {
    return this.userService.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param() { id }: FindUserReqDto): Promise<UserResDto> {
    return this.userService.findOne(id);
  }
}
