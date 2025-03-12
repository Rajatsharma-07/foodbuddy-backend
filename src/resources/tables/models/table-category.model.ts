import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";

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
    name: string
}