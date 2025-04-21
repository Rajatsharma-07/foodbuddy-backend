import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class MenuFetchAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id?: number;


  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class MenuCreateDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  restaurant_id: number;

  @IsBoolean()
  is_active: boolean;
}

export class MenuUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id: number;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}