import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class TableFetchAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class TableCreateDto {
  @IsString()
  name: string;

  @IsBoolean()
  is_active: boolean;

  @Type(() => Number)
  @IsInt()
  restaurant_id: number;

  @Type(() => Number)
  @IsInt()
  category_id: number;
}

export class TableUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id: number;
}