import { ForbiddenException, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
import { Restaurant } from "../../../resources/restaurants/models/restaurant.model";
import { User } from "../../../resources/users/models/user.model";
import {
  TableCategoryCreateDto,
  TableCategoryFetchAllQueryDto,
  TableCategoryUpdateDto,
} from "../dtos/table-categories.dto";
import {
  TableCategoryCreateInterface,
  TableCategoryDeleteInterface,
  TableCategoryFetchAllInterface,
  TableCategoryRetrieveInterface,
  TableCategoryUpdateInterface,
} from "../interfaces/table-categories.interface";
import { TableCategory } from "../models/table-category.model";

@Injectable()
export class TableCategoriesService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: TableCategoryFetchAllQueryDto
  ): Promise<TableCategoryFetchAllInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const {
        page = 1,
        limit,
        offset,
        sort_field,
        sort_order = "asc",
        id,
        name,
        prefix,
      } = query;

      // Pagination: Default to limit of 10 and offset of 0 if not provided
      const pagination_options = limit
        ? {
            limit,
            offset: offset ?? (page - 1) * limit,
          }
        : { limit: 10, offset: 0 };

      // Sorting
      const order_options: any[] = [];
      switch (sort_field) {
        case "restaurant":
          order_options.push([
            { model: Restaurant, as: "restaurant" },
            "name",
            sort_order,
          ]);
          break;
        case undefined:
          order_options.push(["createdAt", sort_order]);
          break;
        default:
          order_options.push([sort_field, sort_order]);
          break;
      }

      // Where clause
      const where_clause: any = {};
      if (!user.is_superuser) {
        where_clause.restaurant_id = user.restaurant_id; // Only non-superusers need this filter
      }

      // Adding search filters to the where clause
      if (id) where_clause.id = id;
      if (name) where_clause.name = { [Op.iLike]: `%${name}%` };
      if (prefix) where_clause.prefix = { [Op.iLike]: `%${prefix}%` };

      // Find users with the specified filters and pagination
      const table_categories = await TableCategory.findAndCountAll({
        where: where_clause,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Restaurant,
            as: "restaurant",
            attributes: ["id", "name"],
          },
        ],
        order: order_options,
        ...pagination_options,
      });

      return {
        success: true,
        data: table_categories.rows,
        total: table_categories.count,
        page,
        limit: limit || table_categories.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<TableCategoryRetrieveInterface> {
    try {
      const table_category = await TableCategory.findOne({ where: { id } });

      if (!table_category) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== table_category.restaurant_id
      ) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_ACCES_DENIED);
      }

      return {
        success: true,
        data: table_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: TableCategoryCreateDto
  ): Promise<TableCategoryCreateInterface> {
    try {
      const table_category = await TableCategory.create({
        ...data,
        restaurant_id: user.restaurant_id,
      });

      return {
        success: true,
        data: table_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: TableCategoryUpdateDto
  ): Promise<TableCategoryUpdateInterface> {
    try {
      const table_category = await TableCategory.findByPk(id);

      if (!table_category) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== table_category.restaurant_id
      ) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_ACCES_DENIED);
      }

      let updated_table_category = await TableCategory.update(
        { ...data },
        {
          where: { id },
        }
      );

      return {
        success: true,
        data: updated_table_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<TableCategoryDeleteInterface> {
    try {
      const table_category = await TableCategory.findByPk(id);

      if (!table_category) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_DOES_NOT_EXISTS);
      }

      if (
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== table_category.restaurant_id
        )
      ) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_ACCES_DENIED);
      }

      const deleted_table = await TableCategory.destroy({ where: { id } });

      return {
        success: true,
        data: deleted_table,
      };
    } catch (error) {
      throw error;
    }
  }
}
