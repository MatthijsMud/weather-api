import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Weather } from "./weather.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Weather])],

})
export class WeatherModule {}