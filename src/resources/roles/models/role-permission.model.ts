import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  Unique,
} from "sequelize-typescript";
import { Role } from "./role.model";
import { Permission } from "../../../resources/permissions/models/permission.model";

@Table({ tableName: "rolepermission" })
export class RolePermission extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Unique("role_permission")
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare role_id: number;
  @BelongsTo(() => Role)
  declare role: Role;

  @Unique("role_permission")
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare permission_id: number;
  @BelongsTo(() => Permission)
  declare permission: Permission;
}
