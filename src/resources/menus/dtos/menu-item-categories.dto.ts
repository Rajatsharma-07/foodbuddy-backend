import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class MenuItemCategoryFetchAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id?: number;
}

export class MenuItemCategoryCreateDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  restaurant_id: number;
}

export class MenuItemCategoryUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id: number;
}