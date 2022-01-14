import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from "./city.entity";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([City])],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule { }
