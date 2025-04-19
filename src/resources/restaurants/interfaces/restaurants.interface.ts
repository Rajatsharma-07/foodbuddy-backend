import { Restaurant } from "../models/restaurant.model";

export interface RestaurantFetchAllInterface {
  success: boolean;
  data: Restaurant[];
}

export interface RestaurantRetrieveInterface {
  success: boolean;
  data: Restaurant;
}

export interface RestaurantCreateInterface {
  success: boolean;
  data: Restaurant;
}

export interface RestaurantUpdateInterface {
  success: boolean;
  data: [number];
}

export interface RestaurantDeleteInterface {
  success: boolean;
  data: [number]
}
