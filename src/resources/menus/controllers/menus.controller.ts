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
import { AuthGuard } from "../../../guards/auth.guard";
import {
  MenuCreateDto,
  MenuFetchAllQueryDto,
  MenuImportDto,
  MenuUpdateDto,
} from "../dtos/menus.dto";
import {
  MenuCreateInterface,
  MenuDeleteInterface,
  MenuFetchAllInterface,
  MenuRetrieveInterface,
  MenuUpdateInterface,
} from "../interfaces/menus.interface";
import { MenusService } from "../services/menus.service";

@Controller("menus")
export class MenusController {
  constructor(private readonly menuService: MenusService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(
    @Request() req,
    @Query() query: MenuFetchAllQueryDto
  ): Promise<MenuFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.menuService.fetch_all(user, query);
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
      const response = await this.menuService.retrieve(user, id);
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
      const response = await this.menuService.create(user, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post("import")
  @UseGuards(AuthGuard)
  async import_data(
    @Request() req,
    @Body() data: MenuImportDto
  ): Promise<MenuCreateInterface> {
    try {
      const user = req.user;
      const response = await this.menuService.import_data(user, data);
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
      const response = await this.menuService.update(user, id, data);
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
      const response = await this.menuService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
