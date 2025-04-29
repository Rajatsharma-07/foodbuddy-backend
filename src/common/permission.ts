import { ROLES } from "src/constants/constants";
import { User } from "src/resources/users/models/user.model";

export async function is_superuser(
  user: Partial<User> & { role: string }
): Promise<Boolean | undefined> {
  return user.is_superuser;
}

export async function is_admin(
  user: Partial<User> & { role: string }
): Promise<Boolean> {
  return !user.is_superuser && user?.role === ROLES.ADMIN;
}
