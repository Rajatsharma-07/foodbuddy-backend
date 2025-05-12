import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class MenuItemFetchAllQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  })
  @IsInt()
  category?: number;

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
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(Number);
    if (value !== undefined && value !== null) return [Number(value)];
    return [];
  })
  @IsArray()
  not_in_array: number[];
}

export class MenuItemCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsInt()
  price: number;

  @IsBoolean()
  is_active: boolean;

  @IsBoolean()
  is_available: boolean;

  @Type(() => Number)
  @IsInt()
  category_id: number;
}

export class MenuItemUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  default_price: number;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsBoolean()
  is_available: boolean;

  @Type(() => Number)
  @IsInt()
  category_id: number;
}
