import { Module } from '@nestjs/common';
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from "./config/configuration";
import { validate } from "./config/env.validation";
import { TasksModule } from "./tasks/tasks.module";
import { CitiesModule } from './cities/cities.module';
import { WeatherModule } from "./weather/weather.module";

@Module({
  imports: [
    ScheduleModule.forRoot(), 
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    }),
    TasksModule, 
    CitiesModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
