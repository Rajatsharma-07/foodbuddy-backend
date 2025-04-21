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
import { MenuItemsService } from "../services/menu-item.service";
import {
  MenuItemCreateDto,
  MenuItemFetchAllQueryDto,
  MenuItemUpdateDto,
} from "../dtos/menu-item.dto";
import {
  MenuItemCreateInterface,
  MenuItemDeleteInterface,
  MenuItemFetchAllInterface,
  MenuItemRetrieveInterface,
  MenuItemUpdateInterface,
} from "../interfaces/menu-item.interface";

@Controller("menu-items")
export class MenuItemsController {
  constructor(private readonly menuItemService: MenuItemsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(
    @Request() req,
    @Query() query: MenuItemFetchAllQueryDto
  ): Promise<MenuItemFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemService.fetch_all(user, query);
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
  ): Promise<MenuItemRetrieveInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemService.retrieve(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req,
    @Body() data: MenuItemCreateDto
  ): Promise<MenuItemCreateInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemService.create(user, data);
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
    @Body() data: MenuItemUpdateDto
  ): Promise<MenuItemUpdateInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemService.update(user, id, data);
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
  ): Promise<MenuItemDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
