import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";

@Table({tableName: 'menus'})
export class Menu extends Model {
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
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare is_active: boolean

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare restaurant_id: number
    @BelongsTo(() => Restaurant)
    declare restaurant: Restaurant
}