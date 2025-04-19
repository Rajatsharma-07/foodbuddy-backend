import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { TableCategory } from "./table-category.model";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";

@Table({tableName: 'tables'})
export class Tables extends Model {
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
        type: DataType.STRING,
        allowNull: false
    })
    status: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_deleted: boolean

    @ForeignKey(() => TableCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    category_id: number
    @BelongsTo(() => TableCategory)
    category: TableCategory

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant
}