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
    declare name: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare address: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare city: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare state: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare country: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pincode: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare is_active: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare is_deleted: boolean
}