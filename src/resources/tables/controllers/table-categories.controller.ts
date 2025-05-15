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
  TableCategoryCreateDto,
  TableCategoryFetchAllQueryDto,
  TableCategoryUpdateDto,
} from "../dtos/table-categories.dto";
import {
  TableCategoryCreateInterface,
  TableCategoryDeleteInterface,
  TableCategoryFetchAllInterface,
  TableCategoryRetrieveInterface,
  TableCategoryUpdateInterface,
} from "../interfaces/table-categories.interface";
import { TableCategoriesService } from "../services/table-categories.service";

@Controller("table-categories")
export class TablesCategoriesController {
  constructor(private readonly tableCategoryService: TableCategoriesService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(
    @Request() req,
    @Query() query: TableCategoryFetchAllQueryDto
  ): Promise<TableCategoryFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.tableCategoryService.fetch_all(user, query);
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
  ): Promise<TableCategoryRetrieveInterface> {
    try {
      const user = req.user;
      const response = await this.tableCategoryService.retrieve(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req,
    @Body() data: TableCategoryCreateDto
  ): Promise<TableCategoryCreateInterface> {
    try {
      const user = req.user;
      const response = await this.tableCategoryService.create(user, data);
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
    @Body() data: TableCategoryUpdateDto
  ): Promise<TableCategoryUpdateInterface> {
    try {
      const user = req.user;
      const response = await this.tableCategoryService.update(user, id, data);
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
  ): Promise<TableCategoryDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.tableCategoryService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
