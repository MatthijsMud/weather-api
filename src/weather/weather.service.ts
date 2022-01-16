import { Injectable, Inject, Logger, HttpException, HttpStatus, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { Repository, LessThan } from "typeorm";
import { Observable, from, of, lastValueFrom, interval, } from "rxjs";
import { switchMap, concatAll, map, tap, delay, bufferCount, zipWith, } from "rxjs/operators";

import { Weather } from "./weather.entity";

@Injectable()
export class WeatherService {

  private readonly logger = new Logger(WeatherService.name)

  private readonly http: HttpService;
  private readonly weather: Repository<Weather>;

  public constructor(
    http: HttpService,
    @InjectRepository(Weather)
    weather: Repository<Weather>
  ) {
    this.http = http;
    this.weather = weather;
  }

  public create() {
    //this.weather.create({ weatherFor })
  }

  public findOne() {

  }

  public findAll() {

  }

  public async updateAll() {

    const requiresUpdate = from(this.weather.find({
      order: { lastUpdated: "ASC" } 
    }));

    // The number of requests that can be made to OpenWeatherMap's API
    // is limited. Prevent requests from being sent out as quickly as
    // possible as way to hopefully stay under this limit.
    const batchInterval = interval(60 * 1000);
    // When a large amount of data is stored in the database, the limit
    // could be quickly reached each time an update is being performed.
    const maxBatchSize = 20;

    requiresUpdate.pipe(
      concatAll(),
      bufferCount(maxBatchSize),
      zipWith(batchInterval),
      // Interval serves to guarantee a minumum amount of time between batches
      map(([weather]) => weather),
    );
  }
}