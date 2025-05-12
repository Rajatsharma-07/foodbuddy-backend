import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Op } from "sequelize";
import { is_superuser } from "src/common/permission";
import { errors } from "src/constants/errors";
import { Restaurant } from "src/resources/restaurants/models/restaurant.model";
import { User } from "src/resources/users/models/user.model";
import { MenuItemFetchAllQueryDto } from "../dtos/menu-item.dto";
import {
  MenuItemCreateInterface,
  MenuItemFetchAllInterface,
  MenuItemRetrieveInterface,
  MenuItemUpdateInterface,
} from "../interfaces/menu-item.interface";
import { MenuDeleteInterface } from "../interfaces/menus.interface";
import { MenuItemCategory } from "../models/menu-item-category.model";
import { MenuItems } from "../models/menu-item.model";

@Injectable()
export class MenuItemsService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: MenuItemFetchAllQueryDto
  ): Promise<MenuItemFetchAllInterface> {
    try {
      // const menu = await Menu.findOne({ where: { menu_id: query?.menu_id } });

      // if (!menu) {
      //   throw new ForbiddenException(errors.MENU_DOES_NOT_EXISTS);
      // }

      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      // if (
      //   !(
      //     (await is_superuser(user)) &&
      //     user.restaurant_id !== menu?.restaurant_id
      //   )
      // ) {
      //   throw new ForbiddenException(errors.MENU_ITEM_ACCES_DENIED);
      // }

      const { page = 1, limit, offset, category, not_in_array } = query;

      // Pagination: Default to limit of 10 and offset of 0 if not provided
      const pagination_options = limit
        ? {
            limit,
            offset: offset ?? (page - 1) * limit,
          }
        : { limit: 10, offset: 0 };

      const where_clause: any = {};
      if (user?.restaurant_id)
        where_clause["restaurant_id"] = user?.restaurant_id;

      if (category) {
        where_clause["category_id"] = category;
      }

      if (not_in_array?.length > 0) {
        where_clause["id"] = { [Op.notIn]: not_in_array };
      }

      const menu_items = await MenuItems.findAndCountAll({
        where: where_clause,
        include: [
          {
            model: MenuItemCategory,
            attributes: ["id", "name"],
          },
          {
            model: Restaurant,
            attributes: ["id", "name"],
          },
        ],
        ...pagination_options,
      });
      return {
        success: true,
        data: menu_items.rows,
        total: menu_items.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuItemRetrieveInterface> {
    try {
      const menu_item = await MenuItems.findByPk(id);

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      return {
        success: true,
        data: menu_item,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: any
  ): Promise<MenuItemCreateInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      let new_data = data;
      if (!(await is_superuser(user))) {
        new_data["restaurant_id"] = user?.restaurant_id;
      }
      console.log(new_data);
      const menu_item = await MenuItems.create({ ...new_data });

      return {
        success: true,
        data: menu_item,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: any
  ): Promise<MenuItemUpdateInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const menu_item = await MenuItems.findByPk(id);

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu_item.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_ACCES_DENIED);
      }

      const updated_menu_item = await MenuItems.update(data, { where: { id } });

      return {
        success: true,
        data: updated_menu_item,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuDeleteInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const menu_item = await MenuItems.findByPk(id);

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu_item.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_ACCES_DENIED);
      }

      const deleted_menu_item = await MenuItems.destroy({ where: { id } });

      return {
        success: true,
        data: deleted_menu_item,
      };
    } catch (error) {
      throw error;
    }
  }
}
