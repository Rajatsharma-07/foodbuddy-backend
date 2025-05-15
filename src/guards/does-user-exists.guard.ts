import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { errors } from "../constants/errors";
import { UsersService } from "../resources/users/services/users.service";

@Injectable()
export class DoesUserExists implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const body = request.body;

      if (!body.phonenumber || !body.otp_code) {
        throw new BadRequestException(errors.PHONE_NUMBER_OR_OTP_IS_MISSING);
      }

      const user = await this.userService.validate_user_by_otp(
        body.phonenumber,
        body.otp_code
      );
      if (!user) {
        throw new UnauthorizedException(errors.INCORRECT_OTP);
      }

      request.user = user;

      return true;
    } catch (error) {
      throw error;
    }
  }
}
