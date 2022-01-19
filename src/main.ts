import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as helmet from "helmet";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({});

  const config = new DocumentBuilder()
    .setTitle("Weather")
    .setDescription("API created as an assignment to assess skill level.")
    .setVersion("0.0.1")
    .addTag("weather")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  
  // Type defintions do not match what is actually exported.
  app.use((helmet as any)());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
