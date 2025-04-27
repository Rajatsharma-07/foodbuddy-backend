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
import { RestaurantsService } from "../services/restaurants.service";
import {
  RestaurantCreateInterface,
  RestaurantDeleteInterface,
  RestaurantFetchAllInterface,
  RestaurantRetrieveInterface,
  RestaurantUpdateInterface,
} from "../interfaces/restaurants.interface";
import { RestaurantCreateDto, RestaurantFetchAllQueryDto } from "../dtos/restaurants.dto";

@Controller("restaurants")
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async fetch_all(@Request() req, @Query() query: RestaurantFetchAllQueryDto): Promise<RestaurantFetchAllInterface> {
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
  ): Promise<RestaurantRetrieveInterface> {
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
    @Body() data: RestaurantCreateDto
  ): Promise<RestaurantCreateInterface> {
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
    @Body() data: RestaurantCreateDto
  ): Promise<RestaurantUpdateInterface> {
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
    @Param("id", ParseIntPipe) id: number,
  ): Promise<RestaurantDeleteInterface> {
    try {
      const user = req.user;
      const response = await this.restaurantService.delete(user, id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
