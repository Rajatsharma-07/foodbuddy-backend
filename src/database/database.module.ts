import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Role } from '../resources/roles/models/role.model';
import { Restaurant } from '../resources/restaurants/models/restaurant.model';
import { User } from '../resources/users/models/user.model';
import { Permission } from '../resources/permissions/models/permission.model';
import { RolePermission } from '../resources/roles/models/role-permission.model';
import { Menu } from '../resources/menus/models/menu.model';
import { MenuItemCategory } from '../resources/menus/models/menu-item-category.model';
import { MenuItems } from '../resources/menus/models/menu-item.model';
import { TableCategory } from '../resources/tables/models/table-category.model';
import { Tables } from '../resources/tables/models/table.model';
import { Order } from '../resources/orders/models/order.model';
import { OrderItem } from '../resources/orders/models/order-item.model';
import { Payment } from '../resources/payments/models/payment.model';
import { Invoice } from '../resources/invoices/models/invoice.model';
import { Otp } from '../resources/users/models/otp.model';
import { MenuItemJunction } from '../resources/menus/models/menu-item-junction.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env variables globally
    SequelizeModule.forRootAsync({
      useFactory: () => {
        const mode = process.env.MODE || 'dev';

        let dbConfig = {};
        switch (mode) {
          case 'prod':
            dbConfig = {
              dialect: process.env.PROD_DIALECT as any,
              host: process.env.PROD_HOST,
              port: Number(process.env.PROD_PORT),
              username: process.env.PROD_USERNAME,
              password: process.env.PROD_PASSWORD,
              database: process.env.PROD_DATABASE,
            };
            break;

          case 'test':
            dbConfig = {
              dialect: process.env.TEST_DIALECT as any,
              host: process.env.TEST_HOST,
              port: Number(process.env.TEST_PORT),
              username: process.env.TEST_USERNAME,
              password: process.env.TEST_PASSWORD,
              database: process.env.TEST_DATABASE,
            };
            break;

          case 'dev':
          default:
            dbConfig = {
              dialect: process.env.DEV_DIALECT as any,
              host: process.env.DEV_HOST,
              port: Number(process.env.DEV_PORT),
              username: process.env.DEV_USERNAME,
              password: process.env.DEV_PASSWORD,
              database: process.env.DEV_DATABASE,
            };
            break;
        }
        return {
          ...dbConfig,
          autoLoadModels: true,
          sync: { alter: true, force: false }, // Careful!! force: true will delete all the data from database
          logging: mode === 'development' ? console.log : false, // Enable logging in dev mode
        };
      },
    }),
    SequelizeModule.forFeature([
      Restaurant,
      Role,
      Permission,
      RolePermission,
      User,
      Menu,
      MenuItemCategory,
      MenuItems,
      MenuItemJunction,
      TableCategory,
      Tables,
      Order,
      OrderItem,
      Payment,
      Invoice,
      Otp
    ]),
  ],
})
export class DatabaseModule {}
