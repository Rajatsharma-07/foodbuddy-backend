import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./resources/users/user.module";
import { RestaurantsModule } from "./resources/restaurants/restaurant.module";
import { TablesModule } from "./resources/tables/table.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    RestaurantsModule,
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
