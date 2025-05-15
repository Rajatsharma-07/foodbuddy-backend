import { Provider } from "@nestjs/common";
import { USER_REPOSITORY } from "../../../constants/repository-constants";
import { User } from "../models/user.model";

export const UsersProvider: Provider[] = [
    {
        provide: USER_REPOSITORY,
        useValue: User
    }
]