import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { Weather } from "./weather.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Weather]), HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}