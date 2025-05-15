import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { is_admin, is_superuser } from "../../../common/permission";
import { errors } from "../../../constants/errors";
import { User } from "../../../resources/users/models/user.model";
import { Restaurant } from "../models/restaurant.model";
import {
  RestaurantCreateInterface,
  RestaurantDeleteInterface,
  RestaurantFetchAllInterface,
  RestaurantRetrieveInterface,
  RestaurantUpdateInterface,
} from "../interfaces/restaurants.interface";
import { Role } from "../../../resources/roles/models/role.model";
import {
  RestaurantCreateDto,
  RestaurantFetchAllQueryDto,
  RestaurantUpdateDto,
} from "../dtos/restaurants.dto";
import { Op } from "sequelize";

@Injectable()
export class RestaurantsService {
  async fetch_all(
    user: Partial<User> & { role: string },
    query: RestaurantFetchAllQueryDto
  ): Promise<RestaurantFetchAllInterface> {
    try {

      if (!(await is_superuser(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const {
        page = 1,
        limit,
        offset,
        sort_field,
        sort_order = "asc",
        id,
        name,
        address,
        city,
        state,
        country,
        pincode,
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

      // Adding search filters to the where clause
      if (id) where_clause.id = id;
      if (name)
        where_clause.name = { [Op.iLike]: `%${name}%` };
      if (address) where_clause.address = { [Op.iLike]: `%${address}%` };
      if (city) where_clause.city = { [Op.iLike]: `%${city}%` };
      if (state) where_clause.state = { [Op.iLike]: `%${state}%` };
      if (country) where_clause.country = { [Op.iLike]: `%${country}%` };
      if (pincode) where_clause.pincode = { [Op.iLike]: `%${pincode}%` };

      const restaurants = await Restaurant.findAndCountAll({
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
  ): Promise<RestaurantRetrieveInterface> {
    try {
      if (!is_superuser(user) && user.restaurant_id !== id) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }
      const where_clause = {
        id,
      };

      if(!await is_superuser(user)){
        where_clause['active'] = true;
      }

      const restaurant = await Restaurant.findOne({
        where: where_clause,
        include: [
          {
            model: User,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "email",
              "role_id",
              "is_active",
            ],
            include: [
              {
                model: Role,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (!restaurant) {
        throw new BadRequestException(errors.RESTAURANT_DOES_NOT_EXISTS);
      }
      return {
        success: true,
        data: restaurant,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: RestaurantCreateDto
  ): Promise<RestaurantCreateInterface> {
    try {
      if (!(await is_superuser(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const restaurant = await Restaurant.create({ ...data });
      return {
        success: true,
        data: restaurant,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: RestaurantUpdateDto
  ): Promise<RestaurantUpdateInterface> {
    try {
      if (!((await is_superuser(user)) || is_admin(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const updated_restaurant = await Restaurant.update(data, {
        where: { id },
      });
      return {
        success: true,
        data: updated_restaurant,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<RestaurantDeleteInterface> {
    try {
      if (!(await is_superuser(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const deleted_restaurant = await Restaurant.update(
        { is_active: false },
        { where: { id } }
      );
      return {
        success: true,
        data: deleted_restaurant,
      };
    } catch (error) {
      throw error;
    }
  }
}
