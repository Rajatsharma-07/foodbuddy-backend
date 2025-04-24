import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { User } from "../models/user.model";
import { UserCreateDto, UserLoginDto, UserUpdateDto } from "../dtos/users.dto";
import {
  UserCreateInterface,
  UserDeleteInterface,
  UserFetchAllInterface,
  UserLoginInterface,
  UserRetrieveInterface,
  UserUpdateInterface,
} from "../interfaces/users.interface";
import { errors } from "src/constants/errors";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Role } from "src/resources/roles/models/role.model";
import { Restaurant } from "src/resources/restaurants/models/restaurant.model";
import { is_superuser, is_admin } from "src/common/permission";

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async validate_user(data: UserLoginDto): Promise<User | null> {
    try {
      const user = await this.validate_user_email(data.email, data?.admin);
      if (!user) return null;
      await this.validate_password(data.password, user?.password);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<UserLoginInterface> {
    try {
      const { password, ...new_user } = user.get({ plain: true });
      const token = await this.generate_jwt_token(new_user);
      return {
        success: true,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async fetch_all(
    user: Partial<User> & { role: string }
  ): Promise<UserFetchAllInterface> {
    try {
      if (!((await is_superuser(user)) || (await is_admin(user)))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }
      let filter = {
        attributes: { exclude: ["password"] },
      };

      if (!user.is_superuser) {
        filter["where"] = {
          restaurant_id: user.restaurant_id,
          is_active: true,
        };
      }
      const users = await User.findAll(filter);
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieve(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<UserRetrieveInterface> {
    try {
      const where_clause = { id, is_active: true };
      const requested_user = await User.findOne({
        where: where_clause,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            attributes: ["name"],
          },
          {
            model: Restaurant,
            attributes: ["name"],
          },
        ],
      });

      if (!requested_user) {
        throw new BadRequestException(errors.USER_DOES_NOT_EXISTS);
      }

      if (
        (id !== user.id &&
          !((await is_superuser(user)) || (await is_admin(user)))) ||
        !(await this.has_permission(user, requested_user))
      ) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      return {
        success: true,
        data: requested_user,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(
    user: Partial<User> & { role: string },
    data: UserCreateDto
  ): Promise<UserCreateInterface> {
    try {
      if (
        !((await is_superuser(user)) || (await is_admin(user))) ||
        !(await this.has_permission_to_create(user, data))
      ) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }
      const restaurant_id = data.restaurant_id || user.restaurant_id;

      const new_user = await User.create({ ...data, restaurant_id });
      return {
        success: true,
        data: new_user,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    user: Partial<User> & { role: string },
    id: number,
    data: UserUpdateDto
  ): Promise<UserUpdateInterface> {
    try {
      let curr_data = await User.findOne({ where: { id } });
      if (!curr_data) {
        throw new Error(errors.USER_DOES_NOT_EXISTS);
      }

      if (!(await is_superuser(user)) && curr_data.is_active) {
        throw new Error(errors.USER_DOES_NOT_EXISTS);
      }

      if (!(await this.has_permission_to_update(user, curr_data, data))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      if (curr_data?.email !== data?.email) {
        throw new BadRequestException(errors.EMAIL_UPDATE_IS_NOT_ALLOWED);
      }

      if (!(await this.has_permission(user, data))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      let updated_user = await User.update(data, { where: { id } });

      return {
        success: true,
        data: updated_user,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(
    user: Partial<User> & { role: string },
    id: number
  ): Promise<UserDeleteInterface> {
    try {
      const curr_data = await User.findOne({
        where: { id, is_active: true },
      });
      if (!curr_data) {
        throw new BadRequestException(errors.USER_DOES_NOT_EXISTS);
      }
      if (!(await is_superuser(user))) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }
      const deleted_user = await User.update(
        { is_active: false },
        { where: { id } }
      );
      return {
        success: true,
        data: deleted_user,
      };
    } catch (error) {
      throw error;
    }
  }

  async has_permission(
    user: Partial<User>,
    requested_user: Partial<User>
  ): Promise<boolean> {
    if (user.is_superuser) {
      return true;
    } else {
      return user.restaurant_id === requested_user.restaurant_id;
    }
  }

  async has_permission_to_create(
    user: Partial<User>,
    data: UserCreateDto
  ): Promise<Boolean> {
    try {
      if (user.is_superuser) {
        if (!data?.restaurant_id) {
          throw new BadRequestException(errors.RESTAURANT_ID_IS_REQUIRED);
        }
      } else {
        if (data?.is_superuser) {
          throw new BadRequestException(
            errors.SUPERUSER_CREATION_IS_NOT_ALLOWED
          );
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async has_permission_to_update(
    user: Partial<User> & { role: string },
    curr_data: Partial<User>,
    data: UserUpdateDto
  ): Promise<Boolean> {
    if (user.id === curr_data.id) {
      if (curr_data?.role_id !== data?.role_id) {
        throw new ForbiddenException(errors.CANNOT_UPDATE_SELF_ROLE);
      } else if (curr_data?.restaurant_id !== data?.restaurant_id) {
        throw new ForbiddenException(errors.CANNOT_UPDATE_SELF_RESTAURANT);
      } else if (curr_data?.is_active !== data?.is_active) {
        throw new ForbiddenException(errors.CANNOT_UPDATE_SELF_ACTIVE_STATUS);
      } else if (curr_data?.is_superuser !== data?.is_superuser) {
        throw new ForbiddenException(
          errors.CANNOT_UPDATE_SELF_SUPERUSER_STATUS
        );
      }

      return true;
    } else if (user?.id !== curr_data?.id && (await is_superuser(user))) {
      return true;
    } else if (user?.id !== curr_data?.id && (await is_admin(user))) {
      if (curr_data?.is_superuser !== data?.is_superuser) {
        throw new ForbiddenException(
          errors.CANNOT_UPDATE_USER_SUPERUSER_STATUS
        );
      }
      if (curr_data?.restaurant_id !== data?.restaurant_id) {
        throw new ForbiddenException(errors.RESTAURANT_UPDATE_IS_NOT_ALLOWED);
      }

      return true;
    }

    return false;
  }

  async validate_user_email(
    email: string,
    admin_panel?: boolean
  ): Promise<User | null> {
    try {
      let where_clause = { email, is_superuser: false, is_active: true };
      if (admin_panel) {
        where_clause["is_superuser"] = true;
      }
      const user = await User.findOne({
        where: where_clause,
        include: [
          { model: Role, attributes: ["name"] },
          { model: Restaurant, attributes: ["name"] },
        ],
      });

      if (!user) {
        throw new UnauthorizedException(errors.INCORRECT_EMAIL_OR_PASSWORD);
      }
      if (!user.is_active) {
        throw new UnauthorizedException(errors.ACCOUNT_IS_DEACTIVATED);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async validate_password(
    password: string,
    hashed_password: string
  ): Promise<Boolean> {
    try {
      const isPasswordValid = await bcrypt.compare(password, hashed_password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(errors.INCORRECT_EMAIL_OR_PASSWORD);
      }
      return isPasswordValid;
    } catch (error) {
      throw new UnauthorizedException(errors.INCORRECT_EMAIL_OR_PASSWORD);
    }
  }

  async generate_jwt_token(user: Partial<User>): Promise<string> {
    try {
      const payload = {
        ...user,
        role: user?.role?.name,
        restaurant: user?.restaurant?.name,
      };
      return await this.jwtService.sign(payload);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
