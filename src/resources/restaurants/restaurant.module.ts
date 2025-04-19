import { Module } from "@nestjs/common";
import { RestaurantsController } from "./controllers/restaurants.controller";
import { RestaurantsProvider } from "./providers/restaurants.provider";
import { RestaurantsService } from "./services/restaurants.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [RestaurantsController],
  providers: [...RestaurantsProvider, RestaurantsService],
  exports: [...RestaurantsProvider, RestaurantsService],
})
export class RestaurantsModule {}
