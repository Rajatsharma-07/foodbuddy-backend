import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MenusController } from "./controllers/menus.controller";
import { MenusProvider } from "./providers/menus.provider";
import { MenusService } from "./services/menus.service";
import { MenuItemCategoriesController } from "./controllers/menu-item-categories.controller";
import { MenuItemCategoriesService } from "./services/menu-item-categories.service";
import { MenuItemsController } from "./controllers/menu-item.controller";
import { MenuItemsService } from "./services/menu-item.service";
import { MenuItemJunctionController } from "./controllers/menu-item-junction.controller";
import { MenuItemJunctionService } from "./services/menu-item-junction.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [MenusController, MenuItemsController, MenuItemCategoriesController, MenuItemJunctionController],
  providers: [...MenusProvider, MenusService, MenuItemsService, MenuItemCategoriesService, MenuItemJunctionService],
  exports: [...MenusProvider, MenusService, MenuItemsService, MenuItemCategoriesService, MenuItemJunctionService],
})
export class MenusModule {}
