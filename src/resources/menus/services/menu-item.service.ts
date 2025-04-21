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
  MenuUpdateDto,
} from "../dtos/menus.dto";
import {
  MenuItemCreateDto,
  MenuItemFetchAllQueryDto,
  MenuItemUpdateDto,
} from "../dtos/menu-item.dto";
import {
  MenuItemCreateInterface,
  MenuItemFetchAllInterface,
  MenuItemRetrieveInterface,
  MenuItemUpdateInterface,
} from "../interfaces/menu-item.interface";
import { MenuItems } from "../models/menu-item.model";

@Injectable()
export class MenuItemsService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: MenuItemFetchAllQueryDto
  ): Promise<MenuItemFetchAllInterface> {
    try {
      const menu = await Menu.findOne({ where: { menu_id: query?.menu_id } });

      if (!menu) {
        throw new ForbiddenException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!((await is_superuser(user)) && !query?.menu_id)) {
        throw new ForbiddenException(errors.MENU_NOT_SELECTED);
      }

      if (
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== menu?.restaurant_id
        )
      ) {
        throw new ForbiddenException(errors.MENU_ITEM_ACCES_DENIED);
      }

      let where_clause = {
        is_active: true,
      };

      if (query?.menu_id) {
        where_clause["menu_id"] = query?.menu_id;
      }

      if (query?.category_id) {
        where_clause["category_id"] = query?.category_id;
      }

      const menu_items = await MenuItems.findAll({ where: where_clause });
      return {
        success: true,
        data: menu_items,
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
      const menu = await Menu.findByPk(menu_item?.menu_id);

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
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
    data: MenuItemCreateDto
  ): Promise<MenuItemCreateInterface> {
    try {
      const menu = await Menu.findByPk(data.menu_id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const menu_item = await MenuItems.create({ ...data });

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
    data: MenuItemUpdateDto
  ): Promise<MenuItemUpdateInterface> {
    try {
      const menu = await Menu.findByPk(id);
      const menu_item = await MenuItems.findByPk(id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
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
      const menu = await Menu.findByPk(id);
      const menu_item = await MenuItems.findByPk(id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!menu_item) {
        throw new BadRequestException(errors.MENU_ITEM_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
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
