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
import {
  TableCreateInterface,
  TableDeleteInterface,
  TableFetchAllInterface,
  TableRetrieveInterface,
  TableUpdateInterface,
} from "../interfaces/tables.interface";
import { TablesService } from "../services/tables.service";
import { TableCreateDto, TableFetchAllQueryDto, TableUpdateDto } from "../dtos/tables.dto";
import { Tables } from "../models/table.model";

@Controller("tables")
export class TablesController {
  constructor(private readonly tableService: TablesService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(
    @Request() req,
    @Query() query: TableFetchAllQueryDto
  ): Promise<TableFetchAllInterface> {
    try {
      const user = req.user;
      const response = await this.tableService.fetch_all(user, query);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  async retrieve(
    @Request() req,
    @Param("id", ParseIntPipe) id: number
  ): Promise<TableRetrieveInterface> {
    try {
      const user = req.user;
      const response = await this.tableService.retrieve(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req,
    @Body() data: TableCreateDto
  ): Promise<TableCreateInterface> {
    try {
      const user = req.user;
      const response = await this.tableService.create(user, data);
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
    @Body() data: TableUpdateDto
  ): Promise<TableUpdateInterface> {
    try {
      const user = req.user;
      const response = await this.tableService.update(user, id, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async delete(@Request() req, @Param("id", ParseIntPipe) id: number): Promise<TableDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.tableService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
