import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class MenuItemFetchAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;


  @IsOptional()
  @IsBoolean()
  menu_id?: boolean;
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

  @Type(() => Number)
  @IsInt()
  menu_id: number;
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
    price: number;
  
    @IsOptional()
    @IsBoolean()
    is_active: boolean;
  
    @IsOptional()
    @IsBoolean()
    is_available: boolean;
  
    @Type(() => Number)
    @IsInt()
    category_id: number;
  
    @Type(() => Number)
    @IsInt()
    menu_id: number;
}