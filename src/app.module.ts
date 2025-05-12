import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./resources/users/user.module";
import { RestaurantsModule } from "./resources/restaurants/restaurant.module";
import { TablesModule } from "./resources/tables/table.module";
import { MenusModule } from "./resources/menus/menu.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"), // Path to your static files
      serveRoot: "/uploads", // URL prefix to access the files
    }),
    DatabaseModule,
    UsersModule,
    RestaurantsModule,
    TablesModule,
    MenusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
