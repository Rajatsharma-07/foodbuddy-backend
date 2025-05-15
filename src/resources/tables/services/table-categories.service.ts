import { ForbiddenException, Injectable } from "@nestjs/common";
import { is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
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
      if (!((await is_superuser(user)) && !query?.restaurant_id)) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      if (
        !(await is_superuser(user)) &&
        query?.restaurant_id !== user.restaurant_id
      ) {
        throw new ForbiddenException(errors.RESTAURANT_ACCESS_DENIED);
      }

      const where_clause = {};

      if (query?.restaurant_id) {
        where_clause["restaurant_id"] = user.restaurant_id;
      }

      const table_categoriess = await TableCategory.findAll({
        where: where_clause,
      });

      return {
        success: true,
        data: table_categoriess,
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
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== table_category.restaurant_id
        )
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
      if (
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== data.restaurant_id
        )
      ) {
        throw new ForbiddenException(errors.RESTAURANT_ACCESS_DENIED);
      }

      const table_category = await TableCategory.create({ ...data });

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
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== table_category.restaurant_id
        )
      ) {
        throw new ForbiddenException(errors.TABLE_CATEGORY_ACCES_DENIED);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== data.restaurant_id
      ) {
        throw new ForbiddenException(errors.RESTAURANT_UPDATE_IS_NOT_ALLOWED);
      }

      let updated_table_category = await TableCategory.update(data, {
        where: { id },
      });

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
