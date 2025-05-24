import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";
import { MenuItemCategory } from "./menu-item-category.model";
import { FOOD_TYPE } from "src/constants/constants";

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
    declare name: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: FOOD_TYPE.VEG,
        values: Object.values(FOOD_TYPE)
    })
    declare food_type: FOOD_TYPE

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare default_price: number

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare is_available: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare is_active: boolean

    @Column({
        type: DataType.STRING
    })
    declare image_path: string

    @ForeignKey(() => MenuItemCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare category_id: number
    @BelongsTo(() => MenuItemCategory)
    declare category: MenuItemCategory

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare restaurant_id: number
    @BelongsTo(() => Restaurant)
    declare restaurant: Restaurant
}