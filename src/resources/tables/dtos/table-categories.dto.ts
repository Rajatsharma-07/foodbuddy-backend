import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class TableCategoryFetchAllQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  restaurant_id?: number;
}

export class TableCategoryCreateDto {
    @IsString()
    name: string;

    @Type(() => Number)
    @IsInt()
    restaurant_id: number;
}

export class TableCategoryUpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    restaurant_id: number;
}