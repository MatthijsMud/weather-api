import { Controller, Get, Post, Delete, Param, Body, } from '@nestjs/common';
import { 
  ApiBadRequestResponse,
  ApiConflictResponse, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiServiceUnavailableResponse 
} from '@nestjs/swagger';
import { Observable, toArray } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CitiesService } from "./cities.service";
import { City } from "./dto/city.dto";
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  
  private readonly cities: CitiesService;

  public constructor(cities: CitiesService) {
    this.cities = cities;
  }

  @ApiOkResponse({ description: "" })
  @Get()
  findAll(): Observable<City[]> {
    return this.cities.findAll().pipe(
      toArray()
    );
  }

  @ApiCreatedResponse({ description: "" })
  @ApiConflictResponse({ description: "City already exists" })
  @ApiServiceUnavailableResponse({ description: "Server has reached the max amount of requests per minute/month" })
  @Post()
  create(@Body() city: CreateCityDto): Observable<string> {
    return this.cities.create(city.name || "").pipe(map(value => JSON.stringify(value)));
  }

  @Delete(":id")
  @ApiBadRequestResponse()
  remove(@Param("id") id: string): string {
    return "";
  }

  @ApiOkResponse({ description: "" })
  @ApiBadRequestResponse()
  @Get("weather")
  lastKnownWeatherForAll(): string {
    return "";
  }

  @ApiOkResponse({ description: "" })
  @ApiBadRequestResponse()
  @Get(":name/weather")
  lastWeeksWeather(@Param("name") name: string): Observable<City[]> {
    return this.cities.findOne(name).pipe(
      toArray()
    );
  }
}
