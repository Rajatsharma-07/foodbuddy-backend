import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

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

export class RestaurantUpdateDto {
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

export class RestaurantFetchAllQueryDto {
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
}
