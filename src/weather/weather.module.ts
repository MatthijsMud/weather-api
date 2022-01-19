import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { City } from "../cities/city.entity";

@Module({
  imports: [TypeOrmModule.forFeature([City]), HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}