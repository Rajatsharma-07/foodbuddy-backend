import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

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

  await Restaurant.create({
    id: 1,
    name: "Demo restaurant",
    address: "Demo address",
    city: "Demo city",
    state: "Demo state",
    country: "Demo country",
    pincode: "Demo pindode",
    is_active: true,
    is_deleted: false,
  });

  // Hash Passwords
  const hashedPassword = await bcrypt.hash("admin@123", BCRYPT_ROUNDS);

  // Insert Users
  await User.bulkCreate([
    {
      id: 1,
      first_name: "Rajat",
      last_name: "Sharma",
      email: "rajatsharmabkn07@gmail.com",
      password: hashedPassword,
      phonenumber: 9079013441,
      is_active: true,
      is_superuser: true,
      is_deleted: false,
      role_id: 1,
    },
    {
      id: 2,
      first_name: "Shweta",
      last_name: "Pandey",
      email: "shwetapandeysp99@gmail.com",
      password: hashedPassword,
      phonenumber: 9079224877,
      is_active: true,
      is_superuser: true,
      is_deleted: false,
      role_id: 1,
    },
    {
      id: 3,
      first_name: "Demo",
      last_name: "Demo",
      email: "demo@gmail.com",
      password: hashedPassword,
      phonenumber: 1234567890,
      is_active: true,
      is_superuser: false,
      is_deleted: false,
      role_id: 1,
      restaurant_id: 1,
    },
  ]);

  await Permission.bulkCreate([
    {
      id: 1,
      name: "Fetch All Users",
      resource: "users",
      url: "/users",
      action: "GET",
    },
    {
      id: 2,
      name: "Retrieve a User",
      resource: "users",
      url: "/users/:id",
      action: "GET",
    },
    {
      id: 3,
      name: "Create a User",
      resource: "users",
      url: "/users",
      action: "POST",
    },
    {
      id: 4,
      name: "Update a User",
      resource: "users",
      url: "/users/:id",
      action: "PUT",
    },
    {
      id: 5,
      name: "Delete a User",
      resource: "users",
      url: "/users/:id",
      action: "DELETE",
    },
    {
      id: 6,
      name: "Fetch All Restaurants",
      resource: "restaurants",
      url: "/restaurants",
      action: "GET",
    },
    {
      id: 7,
      name: "Retrieve a Restaurant",
      resource: "restaurants",
      url: "/restaurants/:id",
      action: "GET",
    },
    {
      id: 8,
      name: "Create a Restaurant",
      resource: "restaurants",
      url: "/restaurants",
      action: "POST",
    },
    {
      id: 9,
      name: "Update a Restaurant",
      resource: "restaurants",
      url: "/restaurants/:id",
      action: "PUT",
    },
    {
      id: 10,
      name: "Delete a Restaurant",
      resource: "restaurants",
      url: "/restaurants/:id",
      action: "DELETE",
    },
    {
      id: 11,
      name: "Fetch All Menus",
      resource: "menus",
      url: "/menus",
      action: "GET",
    },
    {
      id: 12,
      name: "Retrieve a Menu",
      resource: "menus",
      url: "/menus/:id",
      action: "GET",
    },
    {
      id: 13,
      name: "Create a Menu",
      resource: "menus",
      url: "/menus",
      action: "POST",
    },
    {
      id: 14,
      name: "Update a Menu",
      resource: "menus",
      url: "/menus/:id",
      action: "PUT",
    },
    {
      id: 15,
      name: "Delete a Menu",
      resource: "menus",
      url: "/menus/:id",
      action: "DELETE",
    },
    {
      id: 16,
      name: "Fetch All Menu Items",
      resource: "menu-items",
      url: "/menu-items",
      action: "GET",
    },
    {
      id: 17,
      name: "Retrieve a Menu Item",
      resource: "menu-items",
      url: "/menu-items/:id",
      action: "GET",
    },
    {
      id: 18,
      name: "Create a Menu Item",
      resource: "menu-items",
      url: "/menu-items",
      action: "POST",
    },
    {
      id: 19,
      name: "Update a Menu Item",
      resource: "menu-items",
      url: "/menu-items/:id",
      action: "PUT",
    },
    {
      id: 20,
      name: "Delete a Menu Item",
      resource: "menu-items",
      url: "/menu-items/:id",
      action: "DELETE",
    },
    {
      id: 21,
      name: "Fetch All Table Categories",
      resource: "table-categories",
      url: "/table-categories",
      action: "GET",
    },
    {
      id: 22,
      name: "Retrieve a Table Category",
      resource: "table-categories",
      url: "/table-categories/:id",
      action: "GET",
    },
    {
      id: 23,
      name: "Create a Table Category",
      resource: "table-categories",
      url: "/table-categories",
      action: "POST",
    },
    {
      id: 24,
      name: "Update a Table Category",
      resource: "table-categories",
      url: "/table-categories/:id",
      action: "PUT",
    },
    {
      id: 25,
      name: "Delete a Table Category",
      resource: "table-categories",
      url: "/table-categories/:id",
      action: "DELETE",
    },
    {
      id: 26,
      name: "Fetch All Tables",
      resource: "tables",
      url: "/tables",
      action: "GET",
    },
    {
      id: 27,
      name: "Retrieve a Table",
      resource: "tables",
      url: "/tables/:id",
      action: "GET",
    },
    {
      id: 28,
      name: "Create a Table",
      resource: "tables",
      url: "/tables",
      action: "POST",
    },
    {
      id: 29,
      name: "Update a Table",
      resource: "tables",
      url: "/tables/:id",
      action: "PUT",
    },
    {
      id: 30,
      name: "Delete a Table",
      resource: "tables",
      url: "/tables/:id",
      action: "DELETE",
    },
    {
      id: 31,
      name: "Fetch All Menu Categories",
      resource: "menu-categories",
      url: "/menu-categories",
      action: "GET",
    },
    {
      id: 32,
      name: "Retrieve a Menu Category",
      resource: "menu-categories",
      url: "/menu-categories/:id",
      action: "GET",
    },
    {
      id: 33,
      name: "Create a Menu Category",
      resource: "menu-categories",
      url: "/menu-categories",
      action: "POST",
    },
    {
      id: 34,
      name: "Update a Menu Category",
      resource: "menu-categories",
      url: "/menu-categories/:id",
      action: "PUT",
    },
    {
      id: 35,
      name: "Delete a Menu Category",
      resource: "menu-categories",
      url: "/menu-categories/:id",
      action: "DELETE",
    },
    {
      id: 36,
      name: "Fetch All Menu Items by Menu ID",
      resource: "menu-item-junction",
      url: "/menu-item-junction/:menu_id",
      action: "GET",
    },
    {
      id: 37,
      name: "Add Menu Items to Menu",
      resource: "menu-item-junction",
      url: "/menu-item-junction/:menu_id",
      action: "POST",
    },
    {
      id: 38,
      name: "Delete Menu Items from Menu",
      resource: "menu-item-junction",
      url: "/menu-item-junction/:menu_id",
      action: "DELETE",
    },
  ]);
  
  await RolePermission.bulkCreate([
    {
      id: 1,
      role_id: 1,
      permission_id: 1,
    },
    {
      id: 2,
      role_id: 1,
      permission_id: 2,
    },
    {
      id: 3,
      role_id: 1,
      permission_id: 3,
    },
    {
      id: 4,
      role_id: 1,
      permission_id: 4,
    },
    {
      id: 5,
      role_id: 1,
      permission_id: 5,
    },
    {
      id: 6,
      role_id: 1,
      permission_id: 6,
    },
    {
      id: 7,
      role_id: 1,
      permission_id: 7,
    },
    {
      id: 8,
      role_id: 1,
      permission_id: 8,
    },
    {
      id: 9,
      role_id: 1,
      permission_id: 9,
    },
    {
      id: 10,
      role_id: 1,
      permission_id: 10,
    },
    {
      id: 11,
      role_id: 1,
      permission_id: 11,
    },
    {
      id: 12,
      role_id: 1,
      permission_id: 12,
    },
    {
      id: 13,
      role_id: 1,
      permission_id: 13,
    },
    {
      id: 14,
      role_id: 1,
      permission_id: 14,
    },
    {
      id: 15,
      role_id: 1,
      permission_id: 15,
    },
    {
      id: 16,
      role_id: 1,
      permission_id: 16,
    },
    {
      id: 17,
      role_id: 1,
      permission_id: 17,
    },
    {
      id: 18,
      role_id: 1,
      permission_id: 18,
    },
    {
      id: 19,
      role_id: 1,
      permission_id: 19,
    },
    {
      id: 20,
      role_id: 1,
      permission_id: 20,
    },
    {
      id: 21,
      role_id: 1,
      permission_id: 21,
    },
    {
      id: 22,
      role_id: 1,
      permission_id: 22,
    },
    {
      id: 23,
      role_id: 1,
      permission_id: 23,
    },
    {
      id: 24,
      role_id: 1,
      permission_id: 24,
    },
    {
      id: 25,
      role_id: 1,
      permission_id: 25,
    },
    {
      id: 26,
      role_id: 1,
      permission_id: 26,
    },
    {
      id: 27,
      role_id: 1,
      permission_id: 27,
    },
    {
      id: 28,
      role_id: 1,
      permission_id: 28,
    },
    {
      id: 29,
      role_id: 1,
      permission_id: 29,
    },
    {
      id: 30,
      role_id: 1,
      permission_id: 30,
    },
    {
      id: 31,
      role_id: 1,
      permission_id: 31,
    },
    {
      id: 32,
      role_id: 1,
      permission_id: 32,
    },
    {
      id: 33,
      role_id: 1,
      permission_id: 33,
    },
    {
      id: 34,
      role_id: 1,
      permission_id: 34,
    },
    {
      id: 35,
      role_id: 1,
      permission_id: 35,
    },
    {
      id: 36,
      role_id: 1,
      permission_id: 36,
    },
    {
      id: 37,
      role_id: 1,
      permission_id: 37,
    },
    {
      id: 38,
      role_id: 1,
      permission_id: 38,
    },
  ]);
}

seed();
