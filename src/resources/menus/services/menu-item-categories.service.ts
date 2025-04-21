import {
    BadRequestException,
    ForbiddenException,
    Injectable,
  } from "@nestjs/common";
  import { is_superuser } from "src/common/permission";
  import { errors } from "src/constants/errors";
  import { User } from "src/resources/users/models/user.model";
  import { Menu } from "../models/menu.model";
  import { MenuCreateInterface, MenuDeleteInterface, MenuFetchAllInterface, MenuRetrieveInterface, MenuUpdateInterface } from "../interfaces/menus.interface";
  import { MenuCreateDto, MenuFetchAllQueryDto, MenuUpdateDto } from "../dtos/menus.dto";
import { MenuItemCategoryCreateDto, MenuItemCategoryFetchAllQueryDto, MenuItemCategoryUpdateDto } from "../dtos/menu-item-categories.dto";
import { MenuItemCategoryCreateInterface, MenuItemCategoryDeleteInterface, MenuItemCategoryFetchAllInterface, MenuItemCategoryRetrieveInterface, MenuItemCategoryUpdateInterface } from "../interfaces/menu-item-categories.interface";
import { MenuItemCategory } from "../models/menu-item-category.model";
  
  @Injectable()
  export class MenuItemCategoriesService {
    async fetch_all(
      user: Partial<User> & { role: string },
      query: MenuItemCategoryFetchAllQueryDto
    ): Promise<MenuItemCategoryFetchAllInterface> {
      try {
        if (!((await is_superuser(user)) && !query?.restaurant_id)) {
          throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
        }

        if (!((await is_superuser(user)) && user.restaurant_id !== query?.restaurant_id)) {
          throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
        }
  
        let where_clause = {
          is_active: true,
        };
  
        if (query?.restaurant_id) {
          where_clause["restaurant_id"] = query?.restaurant_id;
        }
  
        const menu_item_categories = await MenuItemCategory.findAll({ where: where_clause });
        return {
          success: true,
          data: menu_item_categories,
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
          throw new BadRequestException(errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS);
        }
  
        if (!is_superuser(user) && user.restaurant_id!== menu_item_category.restaurant_id) {
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
        if (!is_superuser(user) && user.restaurant_id!== data.restaurant_id) {
          throw new ForbiddenException(errors.ACCESS_DENIED);
        }
  
        const menu_item_category = await MenuItemCategory.create({...data });
  
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
        const menu_item_category = await MenuItemCategory.findByPk(id);
  
        if (!menu_item_category) {
          throw new BadRequestException(errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS);
        }
  
        if (!is_superuser(user) && user.restaurant_id!== menu_item_category.restaurant_id) {
          throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
        }
  
        const updated_menu_item_category = await MenuItemCategory.update(data, { where: { id } });
  
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
          throw new BadRequestException(errors.MENU_ITEM_CATEGORY_DOES_NOT_EXISTS);
        }
  
        if (!is_superuser(user) && user.restaurant_id!== menu_item_category.restaurant_id) {
          throw new ForbiddenException(errors.MENU_ITEM_CATEGORY_ACCES_DENIED);
        }
  
        const deleted_menu_item_category = await MenuItemCategory.destroy({ where: { id } });
  
        return {
          success: true,
          data: deleted_menu_item_category
        };
      } catch (error) {
        throw error;
      }
    }
  }
  