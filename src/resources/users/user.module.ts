import { Module } from "@nestjs/common";
import { UsersService } from "./services/users.service";
import { UsersController } from "./controllers/users.controller";
import { JwtModule } from "@nestjs/jwt";
import { UsersProvider } from "./providers/user.provider";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your_secret_key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [UsersController],
  providers: [...UsersProvider, UsersService],
  exports: [...UsersProvider, UsersService],
})
export class UsersModule {}
