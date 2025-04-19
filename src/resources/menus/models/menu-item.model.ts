import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { MenuItemCategory } from "./menu-item-category.model";
import { Menu } from "./menu.model";

@Table({tableName: 'menuitems'})
export class MenuItems extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare id: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    price: number

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    description: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_available: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_deleted: boolean

    @ForeignKey(() => MenuItemCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number
    @BelongsTo(() => MenuItemCategory)
    category: MenuItemCategory

    @ForeignKey(() => Menu)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    menu_id: number
    @BelongsTo(() => Menu)
    menu: Menu
}