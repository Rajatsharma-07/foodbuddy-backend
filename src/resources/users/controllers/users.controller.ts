import { Body, Controller, Get, InternalServerErrorException, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { UserCreateInterface, UserFetchAllInterface, UserLoginInterface, UserRetrieveInterface, UserUpdateInterface } from "../interfaces/users.interface";
import { UserCreateDto, UserLoginDto, UserUpdateDto } from "../dtos/users.dto";
import { UsersService } from "../services/users.service";
import { DoesUserExists } from "src/guards/does-user-exists.guard";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post("login")
  @UseGuards(DoesUserExists)
  async login(@Request() req): Promise<UserLoginInterface> {
    try {
      const response = await this.userService.login(req.user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(@Request() req): Promise<UserFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.userService.fetch_all(user);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async retrieve(@Request() req, @Param('id') id: number): Promise<UserRetrieveInterface> {
    try {
      const user = req.user;
      const response = await this.userService.retrieve(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post('')
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() data: UserCreateDto): Promise<UserCreateInterface> {
    try {
      const user = req.user;
      const response = await this.userService.create(user, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Request() req, @Param('id') id: number, @Body() data: UserUpdateDto): Promise<UserUpdateInterface> {
    try {
      const user = req.user;
      const response = await this.userService.update(user, id, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
