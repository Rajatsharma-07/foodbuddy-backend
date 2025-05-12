import { MenuItemJunction } from "../models/menu-item-junction.model";

export interface MenuItemJunctionFetchAllInterface {
  success: boolean;
  data: MenuItemJunction[];
  total: number;
}

export interface MenuItemJunctionAddInterface {
  success: boolean;
  data: string;
}

export interface MenuItemJunctionDeleteInterface {
  success: boolean;
}