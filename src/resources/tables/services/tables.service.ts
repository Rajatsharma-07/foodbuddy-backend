import { ForbiddenException, Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import { Sequelize } from "sequelize-typescript"; // this gives proper types
import { is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";
import { User } from "../../../resources/users/models/user.model";
import {
  TableCreateDto,
  TableFetchAllQueryDto,
  TableUpdateDto,
} from "../dtos/tables.dto";
import {
  TableCreateInterface,
  TableDeleteInterface,
  TableRetrieveInterface,
  TableUpdateInterface,
} from "../interfaces/tables.interface";
import { TableCategory } from "../models/table-category.model";
import { Tables } from "../models/table.model";

@Injectable()
export class TablesService {
  constructor(private readonly sequelize: Sequelize) {}
  async fetch_all(
    user: Partial<User> & { role: string },
    query: TableFetchAllQueryDto
  ): Promise<any> {
    try {
      const where_clause = {};

      if (!(await is_superuser(user))) {
        where_clause["restaurant_id"] = user.restaurant_id;
      }

      const tables = await this.sequelize.query(
        `
        SELECT 
          tc.id as category_id,
          tc.name as category_name,
          tc.prefix as category_prefix,
          json_agg(json_build_object(
            'id', t.id,
            'name', t.name,
            'is_active', t.is_active,
            'status', t.status
          )) as tables
        FROM tables t
        JOIN tablecategory tc ON t.category_id = tc.id
        WHERE t.restaurant_id = :restaurantId
        GROUP BY tc.id, tc.name, tc.prefix
      `,
        {
          replacements: {
            restaurantId: user.restaurant_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      return {
        success: true,
        data: tables,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<TableRetrieveInterface> {
    try {
      const table = await Tables.findOne({
        where: { id },
        include: [
          {
            model: TableCategory,
            attributes: ["id", "name", "prefix"],
            include: [
              {
                model: Restaurant,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      if (!table) {
        throw new ForbiddenException(errors.TABLE_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== table.restaurant_id
      ) {
        throw new ForbiddenException(errors.TABLE_ACCES_DENIED);
      }

      return {
        success: true,
        data: table,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: TableCreateDto
  ): Promise<TableCreateInterface> {
    try {
      const table_category = await TableCategory.findByPk(
        data.table_category_id
      );

      if (!table_category) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_DOES_NOT_EXISTS);
      }

      if (user.restaurant_id !== table_category.restaurant_id) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_ACCES_DENIED);
      }

      const last_table = await Tables.findOne({
        where: {
          category_id: table_category.id,
        },
        order: [["id", "DESC"]],
      });

      let index = 0;

      if (last_table) {
        index = parseInt(last_table.name.split("-")[1]);
      }

      const tables: any = [];
      for (let i = index; i < index + data.number_of_tables; i++) {
        tables.push({
          name: `${table_category.prefix}-${i + 1}`,
          is_active: true,
          restaurant_id: user.restaurant_id,
          category_id: table_category.id,
        });
      }
      const table = await Tables.bulkCreate(tables);
      return {
        success: true,
        data: table,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: TableUpdateDto
  ): Promise<TableUpdateInterface> {
    try {
      const table = await Tables.findByPk(id);

      if (!table) {
        throw new ForbiddenException(errors.TABLE_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== table.restaurant_id
      ) {
        throw new ForbiddenException(errors.TABLE_ACCES_DENIED);
      }

      let updated_table = await Tables.update(
        { ...data, category_id: data.table_category_id },
        { where: { id } }
      );

      return {
        success: true,
        data: updated_table,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<TableDeleteInterface> {
    try {
      const table = await Tables.findByPk(id);

      if (!table) {
        throw new ForbiddenException(errors.TABLE_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== table.restaurant_id
      ) {
        throw new ForbiddenException(errors.TABLE_ACCES_DENIED);
      }

      const deleted_table = await Tables.destroy({ where: { id } });

      return {
        success: true,
        data: deleted_table,
      };
    } catch (error) {
      throw error;
    }
  }
}
