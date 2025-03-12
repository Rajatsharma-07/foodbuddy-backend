import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({tableName: 'restaurants'})
export class Restaurant extends Model {
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
    address: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    city: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    state: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    country: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    pincode: string

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
}