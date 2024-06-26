import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category, Status } from '../type/ticket.enum';

export class FindTicketReqDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class CreateTicketReqDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: Status;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
  })
  remaining_number: number;

  @ApiPropertyOptional()
  @IsOptional()
  imagePath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  category?: Category;
}

export class UpdateTicketReqDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: Status;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  remaining_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  imagePath?: string;
}

export class DeleteTicketReqDto {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  id: string;
}

export class FilteredTicketReqDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  searchTerm: string;
}
