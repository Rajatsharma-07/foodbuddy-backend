import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UserLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  remember: boolean;

  @IsOptional()
  @IsBoolean()
  admin: boolean;
}

export class UserCreateDto { 
  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  email: string

  @IsNumber()
  role_id: number

  @IsOptional()
  @IsNumber()
  restaurant_id: number

  @IsOptional()
  @IsBoolean()
  is_superuser: boolean
}

export class UserUpdateDto { 
  @IsOptional()
  @IsString()
  first_name: string

  @IsOptional()
  @IsString()
  last_name: string

  @IsOptional()
  @IsString()
  email: string

  @IsOptional()
  @IsString()
  password: string

  @IsOptional()
  @IsNumber()
  role_id: number

  @IsOptional()
  @IsNumber()
  restaurant_id: number

  @IsOptional()
  @IsBoolean()
  is_active: boolean

  @IsOptional()
  @IsBoolean()
  is_superuser: boolean
}