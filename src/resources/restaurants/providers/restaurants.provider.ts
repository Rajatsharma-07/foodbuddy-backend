import { Provider } from "@nestjs/common";
import { RETAURANT_REPOSITORY } from "../../../constants/repository-constants";
import { Restaurant } from "../models/restaurant.model";

export const RestaurantsProvider: Provider[] = [
    {
        provide: RETAURANT_REPOSITORY,
        useValue: Restaurant
    }
]