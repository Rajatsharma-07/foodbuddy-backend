import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";
import { Tables } from "../../../resources/tables/models/table.model";

@Table({tableName: 'orders'})
export class Order extends Model {
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
    order_id: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    payment_status: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    amount: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    guest_name: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    guest_number: number

    @ForeignKey(() => Tables)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    table_id: number
    @BelongsTo(() => Tables)
    table: Tables

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant
}