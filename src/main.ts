import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api/v1");
  // Enable ValidationPipe with strict validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unknown properties
      forbidNonWhitelisted: true, // Throws error for extra properties
      transform: true, // Transforms payload to match DTO type
    })
  );
  const PORT = process.env.PORT ?? 3000;
  await app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
bootstrap();
