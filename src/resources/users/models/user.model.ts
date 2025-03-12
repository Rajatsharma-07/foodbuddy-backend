import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";
import { Role } from "../../../resources/roles/models/role.model";

@Table({tableName: 'users'})
export class User extends Model {
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
    first_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    last_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_active: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_deleted: boolean

    @Column({
        type: DataType.BOOLEAN,
    })
    is_superuser: boolean

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    role_id: number
    @BelongsTo(() => Role)
    role: Role

    @ForeignKey(() => Restaurant)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    restaurant_id: number
    @BelongsTo(() => Restaurant)
    restaurant: Restaurant
}