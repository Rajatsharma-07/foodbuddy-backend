import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import * as bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Import Models
import { Role } from "../resources/roles/models/role.model";
import { Restaurant } from "../resources/restaurants/models/restaurant.model";
import { User } from "../resources/users/models/user.model";
import { Permission } from "../resources/permissions/models/permission.model";
import { RolePermission } from "../resources/roles/models/role-permission.model";
import { Menu } from "../resources/menus/models/menu.model";
import { MenuItemCategory } from "../resources/menus/models/menu-item-category.model";
import { MenuItems } from "../resources/menus/models/menu-item.model";
import { TableCategory } from "../resources/tables/models/table-category.model";
import { Tables } from "../resources/tables/models/table.model";
import { Order } from "../resources/orders/models/order.model";
import { OrderItem } from "../resources/orders/models/order-item.model";
import { Payment } from "../resources/payments/models/payment.model";
import { Invoice } from "../resources/invoices/models/invoice.model";
import { BCRYPT_ROUNDS, ROLES } from "../constants/constants";

async function seed() {
  // Database Configuration
  const mode = process.env.MODE || "dev";

  let dbConfig: any = {};
  switch (mode) {
    case "prod":
      dbConfig = {
        dialect: process.env.PROD_DIALECT as any,
        host: process.env.PROD_HOST,
        port: Number(process.env.PROD_PORT),
        username: process.env.PROD_USERNAME,
        password: process.env.PROD_PASSWORD,
        database: process.env.PROD_DATABASE,
      };
      break;

    case "test":
      dbConfig = {
        dialect: process.env.TEST_DIALECT as any,
        host: process.env.TEST_HOST,
        port: Number(process.env.TEST_PORT),
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        database: process.env.TEST_DATABASE,
      };
      break;

    case "dev":
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

  // Initialize Sequelize instance
  const sequelize = new Sequelize({
    ...dbConfig,
    models: [
      Role,
      Restaurant,
      User,
      Permission,
      RolePermission,
      Menu,
      MenuItemCategory,
      MenuItems,
      TableCategory,
      Tables,
      Order,
      OrderItem,
      Payment,
      Invoice,
    ],
    logging: console.log, // Enable logging
  });

  try {
    // Authenticate DB connection
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync Database (optional, only for development)
    await sequelize.sync({ alter: true, force: true });

    // Seed Data
    await seedData();

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

async function seedData() {
  // Insert Roles
  await Role.bulkCreate([
    { id: 1, name: ROLES.ADMIN },
    { id: 2, name: ROLES.PSUEDO_ADMIN },
    { id: 3, name: ROLES.CAPTAIN },
  ]);

  // Hash Passwords
  const hashedPassword = await bcrypt.hash('admin@123', BCRYPT_ROUNDS);

  // Insert Users
  await User.bulkCreate([
    {
      id: 1,
      first_name: "Rajat",
      last_name: "Sharma",
      email: "rajatsharmabkn07.com",
      password: hashedPassword,
      is_active: true,
      is_superuser: true,
      is_deleted: false,
      role_id: 1
    },
    {
      id: 2,
      first_name: "Divyam",
      last_name: "Saraswat",
      email: "divyam88saraswat@gmail.com",
      password: hashedPassword,
      is_active: true,
      is_superuser: true,
      is_deleted: false,
      role_id: 1
    },
  ]);
}

seed();
