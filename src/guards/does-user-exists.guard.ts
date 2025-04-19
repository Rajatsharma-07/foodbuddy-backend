import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { errors } from "src/constants/errors";
import { UsersService } from "src/resources/users/services/users.service";

@Injectable()
export class DoesUserExists implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const body = request.body;

      if (!body.email) {
        throw new UnauthorizedException(errors.EMAIL_IS_REQUIRED);
      }

      const user = await this.userService.validate_user(
        body.admin ? { ...body, admin: true } : body
      );

      if (!user) {
        throw new UnauthorizedException(errors.INCORRECT_EMAIL_OR_PASSWORD);
      }

      request.user = user;

      return true;
    } catch (error) {
      throw error;
    }
  }
}
