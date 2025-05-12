import { MenuItems } from "../models/menu-item.model";

export interface MenuItemFetchAllInterface {
  success: boolean;
  data: MenuItems[];
  total: number;
}

export interface MenuItemRetrieveInterface {
  success: boolean;
  data: MenuItems;
}

export interface MenuItemCreateInterface {
  success: boolean;
  data: MenuItems;
}

export interface MenuItemUpdateInterface {
  success: boolean;
  data: [number];
}

export interface MenuItemDeleteInterface {
  success: boolean;
  data: number;
}
