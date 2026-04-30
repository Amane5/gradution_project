// export class UpdateChildDto {
//     username?: string;
//     firstName?: string;
//     lastName?: string;
//     birthDate?: Date;
//     password?:string
//   }
import { IsString, IsNotEmpty, IsOptional, IsDateString, MinLength } from 'class-validator';

export class UpdateChildDto {
  
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}