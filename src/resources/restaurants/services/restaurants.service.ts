import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { is_admin, is_superuser } from "src/common/permission";
import { errors } from "src/constants/errors";
import { User } from "src/resources/users/models/user.model";
import { Restaurant } from "../models/restaurant.model";
import {
  RestaurantCreateInterface,
  RestaurantDeleteInterface,
  RestaurantFetchAllInterface,
  RestaurantRetrieveInterface,
  RestaurantUpdateInterface,
} from "../interfaces/restaurants.interface";
import { Role } from "src/resources/roles/models/role.model";
import { RestaurantCreateDto } from "../dtos/restaurants.dto";

@Injectable()
export class RestaurantsService {
  async fetch_all(
    user: Partial<User> & { role: string }
  ): Promise<RestaurantFetchAllInterface> {
    try {
      if (!(await is_superuser(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const restaurants = await Restaurant.findAll();
      return {
        success: true,
        data: restaurants,
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
        is_active: true,
        is_deleted: false,
      };
      const restaurant = await Restaurant.findOne({
        where: where_clause,
        include: [
          {
            model: User,
            where: { is_active: true },
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
    data: RestaurantCreateDto
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
