import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Order } from "../../../resources/orders/models/order.model";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";

@Table({tableName: 'invoice'})
export class Invoice extends Model {
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
    invoice_number: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    amount: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    date: string

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_id: number
    @BelongsTo(() => Order)
    order: Order
}