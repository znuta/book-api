// src/users/dto/auth-credentials.dto.ts
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class BookDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  text: string;
}
