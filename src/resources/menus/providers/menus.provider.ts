import { Provider } from "@nestjs/common";
import { MENU_REPOSITORY } from "src/constants/repository-constants";
import { Menu } from "../models/menu.model";

export const MenusProvider: Provider[] = [
    {
        provide: MENU_REPOSITORY,
        useValue: Menu
    }
]