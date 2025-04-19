import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Order } from "../../../resources/orders/models/order.model";

@Table({tableName: 'payments'})
export class Payment extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare id: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    amount: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status: string

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_id: number
    @BelongsTo(() => Order)
    order: Order
}