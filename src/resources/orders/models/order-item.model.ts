import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { MenuItems } from "../../../resources/menus/models/menu-item.model";
import { Order } from "./order.model";

@Table({tableName: 'orderitems'})
export class OrderItem extends Model {
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
        type: DataType.INTEGER,
        allowNull: false
    })
    quantity: number

    @ForeignKey(() => MenuItems)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    item_id: number
    @BelongsTo(() => MenuItems)
    item: MenuItems

    @ForeignKey(() => Order)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    order_id: number
    @BelongsTo(() => Order)
    order: Order
}