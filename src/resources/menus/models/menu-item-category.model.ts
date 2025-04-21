import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Restaurant } from "src/resources/restaurants/models/restaurant.model";

@Table({tableName: 'menuitemcategories'})
export class MenuItemCategory extends Model {
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

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant
}