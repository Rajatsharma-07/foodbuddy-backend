import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { MenuItems } from "./menu-item.model";
import { Menu } from "./menu.model";

@Table({ tableName: "menuitemjunction" })
export class MenuItemJunction extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0.0,
  })
  declare price: number;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare menu_id: number;
  @BelongsTo(() => Menu)
  declare menu: Menu;

  @ForeignKey(() => MenuItems)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare menu_item_id: number;
  @BelongsTo(() => MenuItems)
  declare menu_item: MenuItems;
}
