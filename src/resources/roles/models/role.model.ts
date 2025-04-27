import { Model, Column, DataType, Table, HasMany } from "sequelize-typescript";
import { User } from "src/resources/users/models/user.model";

@Table({ tableName: "roles" })
export class Role extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => User)
  users: User[];
}
