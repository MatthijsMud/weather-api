import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
