import { Module } from '@nestjs/common';
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from "./tasks/tasks.module";
import { CitiesModule } from './cities/cities.module';
import { WeatherModule } from "./weather/weather.module";

@Module({
  imports: [
    ScheduleModule.forRoot(), 
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
