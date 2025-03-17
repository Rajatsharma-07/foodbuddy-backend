import { Model, Column, DataType, Table } from "sequelize-typescript";

@Table({tableName: 'permissions'})
export class Permission extends Model {
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
        type: DataType.STRING,
        allowNull: false
    })
    declare resource: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare url: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare action: string
}