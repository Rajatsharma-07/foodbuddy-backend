import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { User } from "../models/user.model";
import {
  UserCreateDto,
  UserFetchAllQueryDto,
  UserLoginDto,
  UserUpdateDto,
} from "../dtos/users.dto";
import {
  SendOtpInterface,
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
import { Op } from "sequelize";
import { OTP_TYPE } from "src/constants/constants";
import { Otp } from "../models/otp.model";

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async validate_user(data: UserLoginDto): Promise<User | null> {
    try {
      const user = await this.validate_user_phonenumber(
        data.phonenumber,
        data?.admin
      );
      if (!user) return null;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async send_otp(
    phonenumber: number,
    is_admin: boolean
  ): Promise<SendOtpInterface> {
    try {
      if (!phonenumber) {
        throw new BadRequestException(errors.PHONE_NUMBER_IS_REQUIRED);
      }

      const user = await User.findOne({
        where: { phonenumber, is_superuser: is_admin },
      });
      if (!user) {
        throw new BadRequestException(errors.PHONE_NUMBER_NOT_REGISTERED);
      }

      const otp = await this.generateOtp(user.id, OTP_TYPE.LOGIN);

      // Send the OTP via SMS service
      await this.sendOtpToPhone(phonenumber, otp.otp_code);

      return {
        success: true,
        data: "Otp Sent on your registered phone number.",
      };
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<UserLoginInterface> {
    try {
      let { password, ...new_user } = user.get({ plain: true });
      if (!user?.is_superuser) {
        let { is_superuser, ...noraml_user } = new_user;
        new_user = noraml_user;
      }
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
    user: Partial<User> & {
      role: string;
      restaurant_id?: number;
      is_superuser?: boolean;
    },
    query: UserFetchAllQueryDto
  ): Promise<UserFetchAllInterface> {
    try {
      const hasAccess = (await is_superuser(user)) || (await is_admin(user));
      if (!hasAccess) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      const {
        page = 1,
        limit,
        offset,
        sort_field,
        sort_order = "asc",
        id,
        first_name,
        last_name,
        email,
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
        case "role":
          order_options.push([{ model: Role, as: "role" }, "name", sort_order]);
          break;
        case "restaurant":
          order_options.push([
            { model: Restaurant, as: "restaurant" },
            "name",
            sort_order,
          ]);
          break;
        case undefined:
          order_options.push(["createdAt", sort_order]);
          break;
        default:
          order_options.push([sort_field, sort_order]);
          break;
      }

      // Where clause
      const where_clause: any = {};
      if (!user.is_superuser) {
        where_clause.restaurant_id = user.restaurant_id; // Only non-superusers need this filter
        where_clause.is_active = true; // Only non-superusers need to be active
      }
      // Superuser bypasses this condition to see all users

      // Adding search filters to the where clause
      if (id) where_clause.id = id;
      if (first_name)
        where_clause.first_name = { [Op.iLike]: `%${first_name}%` };
      if (last_name) where_clause.last_name = { [Op.iLike]: `%${last_name}%` };
      if (email) where_clause.email = { [Op.iLike]: `%${email}%` };

      // Find users with the specified filters and pagination
      const users = await User.findAndCountAll({
        where: where_clause,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["id", "name"],
          },
          {
            model: Restaurant,
            as: "restaurant",
            attributes: ["id", "name"],
          },
        ],
        order: order_options,
        ...pagination_options,
      });

      return {
        success: true,
        data: users.rows,
        total: users.count,
        page,
        limit: limit || users.count,
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
      const where_clause = { id };
      if (!(await is_superuser(user))) {
        where_clause["is_active"] = true;
      }
      const requested_user = await User.findOne({
        where: where_clause,
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["id", "name"],
          },
          {
            model: Restaurant,
            as: "restaurant",
            attributes: ["id", "name"],
            required: false,
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
        where: { id },
      });
      if (!curr_data) {
        throw new BadRequestException(errors.USER_DOES_NOT_EXISTS);
      }
      if (!curr_data.is_active) {
        throw new BadRequestException(errors.USER_ALREADY_DELETED);
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
      if (!user.is_superuser) {
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

  async validate_user_phonenumber(
    phonenumber: number,
    admin_panel?: boolean
  ): Promise<User | null> {
    try {
      let where_clause = { phonenumber, is_superuser: false };
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
        throw new UnauthorizedException(errors.INCORRECT_PHONE_NUMBER);
      }
      if (!user.is_active) {
        throw new UnauthorizedException(errors.ACCOUNT_IS_DEACTIVATED);
      }
      return user;
    } catch (error) {
      throw error;
    }
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

  async validate_user_by_otp(
    phonenumber: string,
    otp_code: string
  ): Promise<User | null> {
    try {
      const user = await this.validate_user_phone(phonenumber);

      if (!user) throw new UnauthorizedException(errors.INCORRECT_PHONE_NUMBER);

      if (!user.is_active)
        throw new UnauthorizedException(errors.ACCOUNT_IS_DEACTIVATED);

      const otpValid = await this.validate_otp(user.id, otp_code);
      if (!otpValid) return null;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validate_otp(user_id: number, otp_code: string): Promise<boolean> {
    try {
      const otp = await Otp.findOne({
        where: { user_id, otp_code, is_active: true, otp_type: OTP_TYPE.LOGIN },
      });
      if (!otp) {
        throw new UnauthorizedException(errors.INCORRECT_OTP);
      }
      await Otp.update({ is_active: false }, { where: { id: otp.id } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async validate_user_phone(phonenumber: string): Promise<User | null> {
    // Find the user by phone number (update your model if necessary)
    return await User.findOne({
      where: { phonenumber },
      include: [
        { model: Role, attributes: ["id", "name"] },
        { model: Restaurant, attributes: ["id", "name"] },
      ],
    });
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

  private async generateOtp(user_id: number, otp_type: string): Promise<Otp> {
    try {
      await Otp.update(
        { is_active: false },
        { where: { user_id, otp_type, is_active: true } }
      );
      const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = await Otp.create({
        otp_code: otp_code,
        otp_type: otp_type,
        user_id,
      });
      return otp;
    } catch (error) {
      throw error;
    }
  }

  private async sendOtpToPhone(phoneNumber: number, otp: string) {
    // Here you can integrate Twilio/Firebase or any SMS provider
    console.log(
      `Sending OTP ${otp} to phone number ${phoneNumber} - TODO: Connect to SMS Service`
    );
  }
}
