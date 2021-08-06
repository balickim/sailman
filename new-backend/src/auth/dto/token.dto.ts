import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
