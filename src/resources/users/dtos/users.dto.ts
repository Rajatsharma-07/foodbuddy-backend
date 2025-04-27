import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

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
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsNumber()
  role_id: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === null ? undefined : value))
  restaurant_id?: number;

  @IsOptional()
  @IsBoolean()
  is_superuser: boolean;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber()
  role_id: number;

  @IsOptional()
  @IsNumber()
  restaurant_id: number;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsBoolean()
  is_superuser: boolean;
}

export class UserFetchAllQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  sort_field: string;

  @IsOptional()
  @IsIn(["asc", "desc"])
  @IsString()
  sort_order: "asc" | "desc";

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  id: number;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  email: string;
}
