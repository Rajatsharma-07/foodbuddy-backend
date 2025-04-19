import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { errors } from "src/constants/errors";
import { Permission } from "src/resources/permissions/models/permission.model";
import { RolePermission } from "src/resources/roles/models/role-permission.model";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(errors.MISSING_OR_INVALID_TOKEN);
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      const role = decoded.role_id;
      const request_url = request.route.path.split("/api/v1")[1];
      const request_method = request.method;

      if (decoded.is_superuser) {
        return true;
      }

      const has_permission = await RolePermission.findOne({
        where: { role_id: role },
        include: [
          {
            model: Permission,
            where: { url: request_url, action: request_method },
            required: true,
          },
        ],
      });

      if (!has_permission) {
        throw new ForbiddenException(errors.ACCESS_DENIED);
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error; // Allow ForbiddenException to propagate as ACCESS_DENIED
      }
      throw new UnauthorizedException(errors.INVALID_OR_EXPIRED_TOKEN);
    }
  }
}
