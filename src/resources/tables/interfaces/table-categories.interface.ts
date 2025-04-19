import { TableCategory } from "../models/table-category.model";

export interface TableCategoryFetchAllInterface {
  success: boolean;
  data: TableCategory[];
}

export interface TableCategoryRetrieveInterface {
  success: boolean;
  data: TableCategory;
}

export interface TableCategoryCreateInterface {
  success: boolean;
  data: TableCategory;
}

export interface TableCategoryUpdateInterface {
  success: boolean;
  data: [number];
}

export interface TableCategoryDeleteInterface {
  success: boolean;
  data: number;
}
