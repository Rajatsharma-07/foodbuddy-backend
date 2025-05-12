import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { is_superuser } from "src/common/permission";
import { errors } from "src/constants/errors";
import { User } from "src/resources/users/models/user.model";
import { Menu } from "../models/menu.model";
import {
  MenuCreateInterface,
  MenuDeleteInterface,
  MenuFetchAllInterface,
  MenuRetrieveInterface,
  MenuUpdateInterface,
} from "../interfaces/menus.interface";
import {
  MenuCreateDto,
  MenuFetchAllQueryDto,
  MenuImportDto,
  MenuUpdateDto,
} from "../dtos/menus.dto";
import { Op } from "sequelize";
import { MenuItemJunctionService } from "./menu-item-junction.service";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class MenusService {
  constructor(
    private readonly MenuItemJunctionService: MenuItemJunctionService,
    private readonly sequelize: Sequelize
  ) {}
  async fetch_all(
    user: Partial<User> & { role: string },
    query: MenuFetchAllQueryDto
  ): Promise<MenuFetchAllInterface> {
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
        case undefined:
          order_options.push(["createdAt", sort_order]);
          break;
        default:
          order_options.push([sort_field, sort_order]);
          break;
      }
      const where_clause: any = {};

      if (user?.restaurant_id) where_clause.restaurant_id = user.restaurant_id;

      // Adding search filters to the where clause
      if (id) where_clause.id = id;
      if (name) where_clause.name = { [Op.iLike]: `%${name}%` };

      const restaurants = await Menu.findAndCountAll({
        where: where_clause,
        order: order_options,
        ...pagination_options,
      });
      return {
        success: true,
        data: restaurants.rows,
        total: restaurants.count,
        page,
        limit: limit || restaurants.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuRetrieveInterface> {
    try {
      const menu = await Menu.findByPk(id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      return {
        success: true,
        data: menu,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: MenuCreateDto
  ): Promise<MenuCreateInterface> {
    const transaction = await this.sequelize.transaction();
    try {
      const menu_data = data?.menu_data;
      const menu_item_data = data?.menu_item_data;
      const menu = await Menu.create(
        { ...menu_data, restaurant_id: user?.restaurant_id },
        { transaction }
      );
      const menu_item_junction = await this.MenuItemJunctionService.add_items(
        user,
        menu.id,
        menu_item_data,
        transaction
      );
      await transaction.commit();
      return {
        success: true,
        data: menu,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async import_data(
    user: Partial<User> & { role: string },
    data: MenuImportDto
  ): Promise<MenuCreateInterface> {
    const transaction = await this.sequelize.transaction();
    try {
      const menu = await Menu.create(
        { name: data?.name, restaurant_id: user?.restaurant_id },
        { transaction }
      );
      const menu_item_junction = await this.MenuItemJunctionService.import_data(
        user,
        menu.id,
        data?.menu_id,
        transaction
      );
      await transaction.commit();
      return {
        success: true,
        data: menu,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: MenuUpdateDto
  ): Promise<MenuUpdateInterface> {
    const transaction = await this.sequelize.transaction();
    try {
      const menu = await Menu.findByPk(id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      const updated_menu = await Menu.update(data?.menu_data, {
        where: { id },
        transaction,
      });
      await this.MenuItemJunctionService.add_items(
        user,
        id,
        data?.menu_item_data,
        transaction
      );

      await transaction.commit();

      return {
        success: true,
        data: updated_menu,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuDeleteInterface> {
    const transaction = await this.sequelize.transaction();
    try {
      const menu = await Menu.findByPk(id, { transaction });

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      await this.MenuItemJunctionService.delete_all_items(user, id, transaction);

      const deleted_menu = await Menu.destroy({ where: { id }, transaction });
      await transaction.commit();
      return {
        success: true,
        data: deleted_menu,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
