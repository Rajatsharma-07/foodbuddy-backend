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
import {
  MenuItemCategoryCreateDto,
  MenuItemCategoryFetchAllQueryDto,
  MenuItemCategoryUpdateDto,
} from "../dtos/menu-item-categories.dto";
import {
  MenuItemCategoryCreateInterface,
  MenuItemCategoryDeleteInterface,
  MenuItemCategoryFetchAllInterface,
  MenuItemCategoryRetrieveInterface,
  MenuItemCategoryUpdateInterface,
} from "../interfaces/menu-item-categories.interface";
import { MenuItemCategory } from "../models/menu-item-category.model";

@Injectable()
export class MenuItemCategoriesService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: MenuItemCategoryFetchAllQueryDto
  ): Promise<MenuItemCategoryFetchAllInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const {
        page,
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

      const menu_item_categories = await MenuItemCategory.findAndCountAll({
        where: where_clause,
        include: [{ model: Restaurant, attributes: ["id", "name"] }],
        order: order_options,
        ...pagination_options,
      });
      return {
        success: true,
        data: menu_item_categories.rows,
        total: menu_item_categories.count,
        page,
        limit: limit || menu_item_categories.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuItemCategoryRetrieveInterface> {
    try {
      const menu_item_category = await MenuItemCategory.findByPk(id);

      if (!menu_item_category) {
        throw new BadRequestException(
          errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS
        );
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu_item_category.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
      }

      return {
        success: true,
        data: menu_item_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: MenuItemCategoryCreateDto
  ): Promise<MenuItemCategoryCreateInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      let new_data = data;

      if (!(await is_superuser(user))) {
        new_data["restaurant_id"] = user?.restaurant_id;
      }

      console.log(new_data, user);

      const menu_item_category = await MenuItemCategory.create({ ...new_data });

      return {
        success: true,
        data: menu_item_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: MenuItemCategoryUpdateDto
  ): Promise<MenuItemCategoryUpdateInterface> {
    try {
      if (!(await is_superuser(user)) && !user?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const menu_item_category = await MenuItemCategory.findByPk(id);

      if (!menu_item_category) {
        throw new BadRequestException(
          errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS
        );
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu_item_category.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
      }

      const updated_menu_item_category = await MenuItemCategory.update(data, {
        where: { id },
      });

      return {
        success: true,
        data: updated_menu_item_category,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<MenuItemCategoryDeleteInterface> {
    try {
      const menu_item_category = await MenuItemCategory.findByPk(id);

      if (!menu_item_category) {
        throw new BadRequestException(
          errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS
        );
      }

      if (
        !(await is_superuser(user)) &&
        user.restaurant_id !== menu_item_category.restaurant_id
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
      }

      const deleted_menu_item_category = await MenuItemCategory.destroy({
        where: { id },
      });

      return {
        success: true,
        data: deleted_menu_item_category,
      };
    } catch (error) {
      throw error;
    }
  }
}
