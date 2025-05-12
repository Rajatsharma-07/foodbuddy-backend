import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class MenuItemJunctionAddDto {
  @Type(() => Number)
  @IsInt()
  menu_item_id: number;

  @Type(() => Number)
  @IsInt()
  price: number;
}
