import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MenusController } from "./controllers/menus.controller";
import { MenusProvider } from "./providers/menus.provider";
import { MenusService } from "./services/menus.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [MenusController],
  providers: [...MenusProvider, MenusService],
  exports: [...MenusProvider, MenusService],
})
export class MenusModule {}
