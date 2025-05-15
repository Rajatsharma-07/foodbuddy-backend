import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
import { User } from "../../../resources/users/models/user.model";
import {
  TableCreateDto,
  TableFetchAllQueryDto,
  TableUpdateDto,
} from "../dtos/tables.dto";
import {
  TableCreateInterface,
  TableDeleteInterface,
  TableFetchAllInterface,
  TableRetrieveInterface,
  TableUpdateInterface,
} from "../interfaces/tables.interface";
import { Tables } from "../models/table.model";

@Injectable()
export class TablesService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: TableFetchAllQueryDto
  ): Promise<TableFetchAllInterface> {
    try {
      if (!(await is_superuser(user)) && !query?.restaurant_id) {
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
        where_clause["restaurant_id"] = query?.restaurant_id;
      }

      if (query?.category_id) {
        where_clause["category_id"] = query?.category_id;
      }

      if (query?.status) {
        where_clause["status"] = query?.status;
      }

      const tables = await Tables.findAll({ where: where_clause });
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
      const table = await Tables.findOne({ where: { id } });

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
      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== data.restaurant_id
      ) {
        throw new BadRequestException(errors.RESTAURANT_ACCESS_DENIED);
      }

      const table = await Tables.create({ ...data });
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

      let updated_table = await Tables.update(data, { where: { id } });

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
