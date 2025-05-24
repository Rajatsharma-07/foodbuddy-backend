import { Tables } from "../models/table.model";

export interface TableFetchAllInterface {
  success: boolean;
  data: Tables[];
}

export interface TableRetrieveInterface {
  success: boolean;
  data: Tables;
}

export interface TableCreateInterface {
  success: boolean;
  data: Tables[];
}

export interface TableUpdateInterface {
  success: boolean;
  data: [number];
}

export interface TableDeleteInterface {
  success: boolean;
  data: number;
}
