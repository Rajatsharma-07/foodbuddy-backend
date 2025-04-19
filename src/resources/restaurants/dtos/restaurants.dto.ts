import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class RestaurantCreateDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  pincode: string;

  @IsBoolean()
  is_active: boolean;
}

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  pincode: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
