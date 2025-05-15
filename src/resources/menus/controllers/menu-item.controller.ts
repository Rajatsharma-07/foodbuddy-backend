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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import { AuthGuard } from "../../../guards/auth.guard";
import { MenuItemFetchAllQueryDto } from "../dtos/menu-item.dto";
import {
  MenuItemCreateInterface,
  MenuItemDeleteInterface,
  MenuItemFetchAllInterface,
  MenuItemRetrieveInterface,
  MenuItemUpdateInterface,
} from "../interfaces/menu-item.interface";
import { MenuItemsService } from "../services/menu-item.service";

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
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = "./uploads/menu-items";
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    })
  )
  async create(
    @Request() req,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<MenuItemCreateInterface> {
    try {
      const user = req.user;
      if (file) {
        data.image_path = file.filename;
      }
      const response = await this.menuItemService.create(user, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = "./uploads/menu-items";
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    })
  )
  async update(
    @Request() req,
    @Param("id", ParseIntPipe) id: number,
    @Body() data: any,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<MenuItemUpdateInterface> {
    try {
      const user = req.user;

      // Add image_path to the DTO if a file was uploaded
      if (file) {
        data.image_path = file.filename;
      }

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
