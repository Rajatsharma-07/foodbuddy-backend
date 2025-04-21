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

@Injectable()
export class MenusService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: MenuFetchAllQueryDto
  ): Promise<MenuFetchAllInterface> {
    try {
      if (!((await is_superuser(user)) && !query?.restaurant_id)) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      if (
        !(
          (await is_superuser(user)) &&
          user.restaurant_id !== query?.restaurant_id
        )
      ) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      let where_clause = {
        is_active: true,
      };

      if (query?.restaurant_id) {
        where_clause["restaurant_id"] = query?.restaurant_id;
      }

      if (query?.is_active) {
        where_clause["is_active"] = query?.is_active;
      }

      const menus = await Menu.findAll({ where: where_clause });
      return {
        success: true,
        data: menus,
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

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
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
    try {
      if (!is_superuser(user) && user.restaurant_id !== data.restaurant_id) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const menu = await Menu.create({ ...data });

      return {
        success: true,
        data: menu,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: MenuUpdateDto
  ): Promise<MenuUpdateInterface> {
    try {
      const menu = await Menu.findByPk(id);

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      const updated_menu = await Menu.update(data, { where: { id } });

      return {
        success: true,
        data: updated_menu,
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

      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (!is_superuser(user) && user.restaurant_id !== menu.restaurant_id) {
        throw new ForbiddenException(errors.MENU_ACCES_DENIED);
      }

      const deleted_menu = await Menu.destroy({ where: { id } });

      return {
        success: true,
        data: deleted_menu,
      };
    } catch (error) {
      throw error;
    }
  }
}
