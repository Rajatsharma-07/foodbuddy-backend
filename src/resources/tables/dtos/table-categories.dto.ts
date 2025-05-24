import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class TableCategoryFetchAllQueryDto {
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
  prefix: string;
}

export class TableCategoryCreateDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    prefix: string;
}

export class TableCategoryUpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    prefix: string;
}