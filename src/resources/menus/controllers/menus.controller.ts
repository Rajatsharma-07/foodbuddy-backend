import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { MenuCreateInterface, MenuDeleteInterface, MenuFetchAllInterface, MenuRetrieveInterface, MenuUpdateInterface } from "../interfaces/menus.interface";
import { MenusService } from "../services/menus.service";
import { MenuCreateDto, MenuFetchAllQueryDto, MenuUpdateDto } from "../dtos/menus.dto";

@Controller("menus")
export class MenusController {
  constructor(private readonly restaurantService: MenusService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(
    @Request() req,
    @Query() query: MenuFetchAllQueryDto
  ): Promise<MenuFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.restaurantService.fetch_all(user, query);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async retrieve(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<MenuRetrieveInterface> {
    try {
      const user = req.user;
      const response = await this.restaurantService.retrieve(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req,
    @Body() data: MenuCreateDto
    ): Promise<MenuCreateInterface> {
      try {
        const user = req.user;
        const response = await this.restaurantService.create(user, data);
        return response;
      } catch (error) {
        throw error;
      }
    }

  @Put(":id")
  @UseGuards(AuthGuard)
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() data: MenuUpdateDto
  ): Promise<MenuUpdateInterface> {
    try {
      const user = req.user;
      const response = await this.restaurantService.update(user, id, data);
      return response;
    } catch (error) {
      throw error;
    }
  }


  @Delete(":id")
  @UseGuards(AuthGuard)
  async delete(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<MenuDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.restaurantService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
