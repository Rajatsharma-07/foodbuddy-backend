import { Model, Column, DataType, Table } from "sequelize-typescript";

@Table({tableName: 'roles'})
export class Role extends Model {
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
}