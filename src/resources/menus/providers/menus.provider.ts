import { Provider } from "@nestjs/common";
import { MENU_ITEM_CATEGORY_REPOSITORY, MENU_REPOSITORY, MENU_ITEM_REPOSITORY, MENU_ITEM_JUNCTION_REPOSITORY } from "src/constants/repository-constants";
import { Menu } from "../models/menu.model";
import { MenuItemCategory } from "../models/menu-item-category.model";
import { MenuItems } from "../models/menu-item.model";
import { MenuItemJunction } from "../models/menu-item-junction.model";

export const MenusProvider: Provider[] = [
    {
        provide: MENU_REPOSITORY,
        useValue: Menu
    },

    {
        provide: MENU_ITEM_CATEGORY_REPOSITORY,
        useValue: MenuItemCategory
    },

    {
        provide: MENU_ITEM_REPOSITORY,
        useValue: MenuItems
    },

    {
        provide: MENU_ITEM_JUNCTION_REPOSITORY,
        useValue: MenuItemJunction
    },
]