import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TablesController } from "./controllers/tables.controller";
import { TablesProvider } from "./providers/tables.provider";
import { TablesService } from "./services/tables.service";
import { TablesCategoriesController } from "./controllers/table-categories.controller";
import { TableCategoriesService } from "./services/table-categories.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [TablesController, TablesCategoriesController],
  providers: [...TablesProvider, TablesService, TableCategoriesService],
  exports: [...TablesProvider, TablesService, TableCategoriesService],
})
export class TablesModule {}
