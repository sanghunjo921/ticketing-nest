import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number, default = 1',
  })
  @Transform(({ value }) => parseInt(value)) //parseInt와 Number가 다를때는 parseInt는 8진수 10진수, 16진수 등 적용가능 ex) parseInt("a", 16). parseFloat()는 소숫점을 붙여줌
  @IsInt() // isNaN으로 확인해서 스트링 "1"을 보내면 내부적으로 캐스팅해서 실행 -> 문자열타입의 숫자도 잡지를 못함 그래서 Transform 사용
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Page number, default = 10',
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  size: number;
}
