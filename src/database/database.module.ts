import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Role } from '../resources/roles/models/role.model';

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
          sync: { alter: false, force: false },
          logging: mode === 'development' ? console.log : false, // Enable logging in dev mode
        };
      },
    }),
    SequelizeModule.forFeature([Role]),
  ],
})
export class DatabaseModule {}
