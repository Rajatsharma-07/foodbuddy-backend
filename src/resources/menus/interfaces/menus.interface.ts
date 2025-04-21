import { Menu } from "../models/menu.model";

export interface MenuFetchAllInterface {
    success: boolean;
    data: Menu[];
}

export interface MenuRetrieveInterface {
    success: boolean;
    data: Menu;
}

export interface MenuCreateInterface {
    success: boolean;
    data: Menu;
}

export interface MenuUpdateInterface {
    success: boolean;
    data: [number];
}

export interface MenuDeleteInterface {
    success: boolean;
    data: number;
}