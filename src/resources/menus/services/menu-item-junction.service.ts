import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
import { User } from "../../../resources/users/models/user.model";
import { MenuItemJunctionAddDto } from "../dtos/menu-item-junction.dto";
import {
  MenuItemJunctionAddInterface,
  MenuItemJunctionDeleteInterface,
  MenuItemJunctionFetchAllInterface,
} from "../interfaces/menu-item-junction.interface";
import { MenuItemCategory } from "../models/menu-item-category.model";
import { MenuItemJunction } from "../models/menu-item-junction.model";
import { MenuItems } from "../models/menu-item.model";
import { Menu } from "../models/menu.model";

@Injectable()
export class MenuItemJunctionService {
  constructor(private readonly sequelize: Sequelize) {}

  async fetch_all_by_menu_id(
    user: Partial<User> & { role: string },
    menu_id: number
  ): Promise<MenuItemJunctionFetchAllInterface> {
    try {
      const menu = await Menu.findOne({ where: { id: menu_id } });
      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }
      if (
        !(await is_superuser(user)) &&
        user?.restaurant_id !== menu?.restaurant_id
      ) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      const response = await MenuItemJunction.findAndCountAll({
        where: { menu_id },
        include: [
          {
            model: MenuItems,
            attributes: [
              "id",
              "name",
              "category_id",
              "image_path",
              "default_price",
              "is_active",
              "description",
              "food_type",
            ],
            include: [
              {
                model: MenuItemCategory,
                as: "category",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
        order: [
          [
            { model: MenuItems, as: "menu_item" },
            { model: MenuItemCategory, as: "category" },
            "name",
            "ASC",
          ],
        ],
      });

      return {
        data: response.rows,
        success: true,
        total: response.count,
      };
    } catch (error) {
      throw error;
    }
  }

  async add_items(
    user: Partial<User> & { role: string },
    menu_id: number,
    data: MenuItemJunctionAddDto[],
    t?: any
  ): Promise<MenuItemJunctionAddInterface> {
    // Wrap the whole logic in an atomic transaction
    const transaction = t ? t : await this.sequelize.transaction();
    const isExternalTransaction = !!t;
    try {
      const menu = await Menu.findOne({ where: { id: menu_id }, transaction });
      if (!menu) {
        throw new BadRequestException(errors.MENU_DOES_NOT_EXISTS);
      }

      if (
        !(await is_superuser(user)) &&
        user?.restaurant_id !== menu?.restaurant_id
      ) {
        throw new ForbiddenException(errors.RESTAURANT_NOT_SELECTED);
      }

      // Step 1: Delete existing items for the menu
      await MenuItemJunction.destroy({
        where: { menu_id },
        transaction,
      });

      // Step 2: Map new data with menu_id
      const new_data = data.map((item: MenuItemJunctionAddDto) => {
        return {
          ...item,
          menu_id,
        };
      });

      // Step 3: Bulk insert new items
      const response = await MenuItemJunction.bulkCreate(new_data, {
        transaction,
      });

      // Step 4: Commit
      if (!isExternalTransaction) {
        await transaction.commit();
      }

      return {
        data: "Items Added to your Menu!",
        success: true,
      };
    } catch (error) {
      if (!isExternalTransaction) {
        await transaction.commit();
      }
      throw error;
    }
  }

  async import_data(
    user: Partial<User> & { role: string },
    to_menu_id: number,
    from_menu_id: number,
    t?: any
  ): Promise<MenuItemJunctionAddInterface> {
    const transaction = t ? t : await this.sequelize.transaction();
    const isExternalTransaction = !!t;
    try {
      const from_menu_data = await MenuItemJunction.findAll({
        where: { menu_id: from_menu_id },
        transaction,
      });
      const new_data: any = [];
      from_menu_data?.forEach((item: MenuItemJunction) => {
        let data = {
          menu_id: to_menu_id,
          price: item.price,
          menu_item_id: item.menu_item_id,
        };
        new_data.push(data);
      });

      await MenuItemJunction.bulkCreate(new_data, { transaction });

      if (!isExternalTransaction) {
        await transaction.commit();
      }

      return {
        data: "Items Added to your Menu!",
        success: true,
      };
    } catch (error) {
      if (!isExternalTransaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async delete_items(
    user: Partial<User> & { role: string },
    menu_id: number,
    data: number[]
  ): Promise<MenuItemJunctionDeleteInterface> {
    try {
      data?.forEach(async (menu_item_id: number) => {
        await MenuItemJunction.destroy({ where: { menu_item_id, menu_id } });
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async delete_all_items(
    user: Partial<User> & { role: string },
    menu_id: number,
    t: any
  ): Promise<MenuItemJunctionDeleteInterface> {
    const transaction = t ? t : await this.sequelize.transaction();
    const isExternalTransaction = !!t;
    try {
      await MenuItemJunction.destroy({ where: { menu_id }, transaction });
      if (!isExternalTransaction) {
        await transaction.commit();
      }
      return { success: true };
    } catch (error) {
      if (!isExternalTransaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }
}
