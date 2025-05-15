import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";

@Table({tableName: 'tablecategory'})
export class TableCategory extends Model {
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

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant
}