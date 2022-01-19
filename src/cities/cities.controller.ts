import { Controller, Get, Post, Delete, Param, Body, HttpException, } from '@nestjs/common';
import { 
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiServiceUnavailableResponse 
} from '@nestjs/swagger';
import { Observable, toArray } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { CitiesService } from "./cities.service";
import { CityDto } from "./dto/city.dto";
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  
  private readonly cities: CitiesService;

  public constructor(cities: CitiesService) {
    this.cities = cities;
  }

  @ApiOkResponse({ description: "" })
  @Get()
  findAll(): Promise<CityDto[]> {
    return this.cities.findAll();
  }

  @ApiCreatedResponse({ description: "" })
  @ApiConflictResponse({ description: "City already exists" })
  @ApiServiceUnavailableResponse({ description: "Server has reached the max amount of requests per minute/month" })
  @Post()
  create(@Body() city: CreateCityDto): Promise<CityDto> {
    return this.cities.create(city.name);
  }

  @Delete(":id")
  @ApiAcceptedResponse()
  @ApiBadRequestResponse()
  remove(@Param("id") id: string): Promise<{}> {
    return this.cities.remove(id);
  }

  @ApiOkResponse({ description: "" })
  @ApiBadRequestResponse()
  @Get("weather")
  lastKnownWeatherForAll(): Promise<CityDto[]> {
    return this.cities.findAll();
  }

  @ApiOkResponse({ description: "" })
  @ApiBadRequestResponse()
  @Get(":name/weather")
  lastWeeksWeather(@Param("name") name: string): Promise<any> {
    return this.cities.weatherFor(name);
  }
}
