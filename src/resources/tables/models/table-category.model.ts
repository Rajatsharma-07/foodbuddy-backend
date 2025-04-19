import { Model, Column, DataType, Table, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript";
import { Restaurant } from "src/resources/restaurants/models/restaurant.model";
import { User } from "src/resources/users/models/user.model";

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