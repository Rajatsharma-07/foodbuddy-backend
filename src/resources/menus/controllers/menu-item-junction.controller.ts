import {
    Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { MenuItemJunctionAddInterface, MenuItemJunctionDeleteInterface, MenuItemJunctionFetchAllInterface } from "../interfaces/menu-item-junction.interface";
import { MenuItemJunctionService } from "../services/menu-item-junction.service";
import { MenuItemJunctionAddDto } from "../dtos/menu-item-junction.dto";

@Controller("menu-item-junction")
export class MenuItemJunctionController {
  constructor(
    private readonly menuItemJunctionService: MenuItemJunctionService
  ) {}

  @Get(":menu_id")
  @UseGuards(AuthGuard)
  async fetch_all_by_menu_id(
    @Request() req,
    @Param("menu_id", ParseIntPipe) menu_id: number
  ): Promise<MenuItemJunctionFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemJunctionService.fetch_all_by_menu_id(
        user,
        menu_id
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post(":menu_id")
  @UseGuards(AuthGuard)
  async add_items(
    @Request() req,
    @Param("menu_id", ParseIntPipe) menu_id: number,
    @Body() data: MenuItemJunctionAddDto[]
  ): Promise<MenuItemJunctionAddInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemJunctionService.add_items(
        user,
        menu_id,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Delete(":menu_id")
  @UseGuards(AuthGuard)
  async delete_items(
    @Request() req,
    @Param("menu_id", ParseIntPipe) menu_id: number,
    @Body() data: number[]
  ): Promise<MenuItemJunctionDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.menuItemJunctionService.delete_items(
        user,
        menu_id,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

}
