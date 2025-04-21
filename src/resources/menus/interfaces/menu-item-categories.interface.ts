import { MenuItemCategory } from "../models/menu-item-category.model";

export interface MenuItemCategoryFetchAllInterface {
  success: boolean;
  data: MenuItemCategory[];
}

export interface MenuItemCategoryRetrieveInterface {
  success: boolean;
  data: MenuItemCategory;
}

export interface MenuItemCategoryCreateInterface {
  success: boolean;
  data: MenuItemCategory;
}

export interface MenuItemCategoryUpdateInterface {
  success: boolean;
  data: [number];
}

export interface MenuItemCategoryDeleteInterface {
  success: boolean;
  data: number;
}
