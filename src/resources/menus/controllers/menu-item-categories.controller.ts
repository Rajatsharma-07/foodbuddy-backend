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
import { MenuItemCategoriesService } from "../services/menu-item-categories.service";
import { MenuItemCategoryCreateInterface, MenuItemCategoryDeleteInterface, MenuItemCategoryFetchAllInterface, MenuItemCategoryRetrieveInterface, MenuItemCategoryUpdateInterface } from "../interfaces/menu-item-categories.interface";
import { MenuItemCategoryCreateDto, MenuItemCategoryFetchAllQueryDto, MenuItemCategoryUpdateDto } from "../dtos/menu-item-categories.dto";
  
  @Controller("menu-categories")
  export class MenuItemCategoriesController {
    constructor(private readonly menuCategoryService: MenuItemCategoriesService) {}
  
    @Get()
    @UseGuards(AuthGuard)
    async fetch_all(
      @Request() req,
      @Query() query: MenuItemCategoryFetchAllQueryDto
    ): Promise<MenuItemCategoryFetchAllInterface> {
      try {
        const user = req.user;
        const response = await this.menuCategoryService.fetch_all(user, query);
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
    ): Promise<MenuItemCategoryRetrieveInterface> {
      try {
        const user = req.user;
        const response = await this.menuCategoryService.retrieve(user, id);
        return response;
      } catch (error) {
        throw error;
      }
    }
  
    @Post()
    @UseGuards(AuthGuard)
    async create(
      @Request() req,
      @Body() data: MenuItemCategoryCreateDto
      ): Promise<MenuItemCategoryCreateInterface> {
        try {
          const user = req.user;
          const response = await this.menuCategoryService.create(user, data);
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
      @Body() data: MenuItemCategoryUpdateDto
    ): Promise<MenuItemCategoryUpdateInterface> {
      try {
        const user = req.user;
        const response = await this.menuCategoryService.update(user, id, data);
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
    ): Promise<MenuItemCategoryDeleteInterface> {
      try {
        const user = req.user;
        const response = await this.menuCategoryService.delete(user, id);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
  