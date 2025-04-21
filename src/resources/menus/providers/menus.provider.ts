import { Provider } from "@nestjs/common";
import { MENU_ITEM_CATEGORY_REPOSITORY, MENU_REPOSITORY } from "src/constants/repository-constants";
import { Menu } from "../models/menu.model";
import { MenuItemCategory } from "../models/menu-item-category.model";

export const MenusProvider: Provider[] = [
    {
        provide: MENU_REPOSITORY,
        useValue: Menu
    },

    {
        provide: MENU_ITEM_CATEGORY_REPOSITORY,
        useValue: MenuItemCategory
    },
]