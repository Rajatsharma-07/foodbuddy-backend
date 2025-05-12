import { Transform } from "class-transformer";
import {
  IsArray,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class MenuFetchAllQueryDto {
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
}

export class MenuCreateDto {
  @IsObject()
  menu_data: any;

  @IsOptional()
  @IsArray()
  menu_item_data: any;
}

export class MenuUpdateDto {
  @IsObject()
  menu_data: any;

  @IsOptional()
  @IsArray()
  menu_item_data: any;
}

export class MenuImportDto {
  @IsString()
  name: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  menu_id: number;
}