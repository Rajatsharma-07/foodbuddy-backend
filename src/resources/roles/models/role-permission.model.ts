import { Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Role } from "./role.model";
import { Permission } from "../../../resources/permissions/models/permission.model";

@Table({tableName: 'rolepermission'})
export class RolePermission extends Model {
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare id: number

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    role_id: number
    @BelongsTo(() => Role)
    role: Role

    @ForeignKey(() => Permission)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    permission_id: number
    @BelongsTo(() => Permission)
    permission: Permission
}