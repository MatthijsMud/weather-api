import { Injectable, Inject, Logger, HttpException, HttpStatus, } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ClientProxy }  from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectID, Repository, } from "typeorm";
import { Observable, from, of, lastValueFrom, } from "rxjs";
import { switchMap, concatAll, map, tap, switchAll, } from "rxjs/operators";

import { City } from "./city.entity";
import { WeatherDto } from "../weather/dto/Weather.dto";

@Injectable()
export class CitiesService {
  
  private readonly logger = new Logger(CitiesService.name)

  private readonly http: HttpService;
  private readonly city: Repository<City>;
  private readonly client: ClientProxy;
  
  public constructor (
    http: HttpService, 
    @InjectRepository(City)
    city: Repository<City>,

    @Inject("WEATHER_UPDATER_SERVICE") 
    client: ClientProxy,

  ) {
    this.http = http;
    this.city = city;
    this.client = client;
  }

  public async create(name: string): Promise<City> {
    const existing = await this.city.findOne({ name });

    if (existing) {
      throw new HttpException("City already exists.", HttpStatus.CONFLICT);
    }
    const weather = await lastValueFrom(this.client.send<WeatherDto>({ cmd: "retrieve" }, name));
    return this.city.save({ weather, name });
  } 

  public async findOne(name: string): Promise<City> {
    const city = await this.city.findOne({ name });
    return city!;
  }

  public findAll(): Promise<City[]> {
    // Consideration: Check whether any are outdated
    // Assume everything is kept up-to-date by the other
    // running background services.
    return this.city.find();
  }

  public async remove(id: string): Promise<{}> {
    this.logger.log(`About to remove city with id [${id}].`);
    try {

      const result = await this.city.delete(id);
      if (result.affected){
        this.logger.log(`Entry with id [${id}] is no longer present in the database.`);
      } else {
        this.logger.log(`Id ${id} was not present in database.`);
      }
      return {};
    }
    catch (error) {
      this.logger.error(`Failed to remove city from database\n${error}`);
      throw error;
    }
  } 

  public async weatherFor(name: string): Promise<City> {
    const response = await this.city.findOne({ name });
    const weather = await lastValueFrom(this.client.send({ cmd: "create" }, name));
    console.log(weather);
    return response!;
  }
}