import { Provider } from "@nestjs/common";
import { TABLE_CATEGORY_REPOSITORY, TABLE_REPOSITORY } from "../../..//constants/repository-constants";
import { Tables } from "../models/table.model";
import { TableCategory } from "../models/table-category.model";

export const TablesProvider: Provider[] = [
    {
        provide: TABLE_REPOSITORY,
        useValue: Tables
    },

    {
        provide: TABLE_CATEGORY_REPOSITORY,
        useValue: TableCategory
    },
]