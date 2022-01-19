import { Injectable, Inject, Logger, HttpException, HttpStatus, InternalServerErrorException, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Repository, } from "typeorm";
import { Observable, from, of, } from "rxjs";
import { concatAll, map, tap, delay, bufferCount, concatMap, retryWhen, filter, catchError, ignoreElements, concatWith, mergeAll, single, switchAll } from "rxjs/operators";

import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { City } from "../cities/city.entity";
import { FromOpenWeatherMapDto } from "./dto/fromOpenWeatherMap.dto";
import { WeatherDto } from "./dto/weather.dto";

@Injectable()
export class WeatherService {

  private readonly logger = new Logger(WeatherService.name)

  private readonly http: HttpService;
  private readonly weather: Repository<City>;
  private readonly config: ConfigService;

  public constructor(
    http: HttpService,
    @InjectRepository(City)
    weather: Repository<City>,
    config: ConfigService
  ) {
    this.http = http;
    this.weather = weather;
    this.config = config;
  }

  /**
   * For some errors with HTTP requests it is highly unlikely that
   * retrying will yield a "correct" response (most in the 4XX range); 
   * skip those errors as to not waste anyone's time.
   * 
   * This method is to be used with the `retryWhen` operator. 
   * ```ts
   * retryWhen(this.httpRequestWorthRetrying)
   * ```
   * @param errors Stream of errors that are encountered.
   * @returns 
   */
  private httpRequestWorthRetrying<T>(errors: Observable<T>): Observable<T> {
    return errors.pipe(
      filter(error => true)
    );
  }

  private getCurrentWeatherFor(name: string): Observable<WeatherDto> {
    const key = this.config.get<string>("weatherApiKey");
    // Consideration: Make configurable.
    // Given the fact that other API's probably don't yield the same response, 
    // this has a low priority.
    const url = "https://api.openweathermap.org/data/2.5/weather";

    return this.http.get(url, {
      params: {
        appid: key,
        q: name,
      }
    }).pipe(
      retryWhen(this.httpRequestWorthRetrying),
      // Encountered an error that is not worth retrying, this likely
      // means the configuration is incorrect.
      catchError(error => {
        // Logger does not work well with objects with circular references.
        // We cannot simply log the error, as we don't know whether it
        // has any such references.
        const message = error?.message;
        if (typeof message === "string") {
          this.logger.error(`Error in API response.\n${message}`);
        } else {
          this.logger.error("Encountered an error with OpenWeatherMap's API response.");
        }
        throw new InternalServerErrorException({});
      }),
      map(response => {
        const data = plainToInstance(FromOpenWeatherMapDto, response.data);
        return from(validate(data)).pipe(
          filter(errors => errors.length > 0),
          tap(errors => {
            this.logger.error(`OpenWeatherMaps API responded with object that does not match its schema\n${errors}`);
            throw new InternalServerErrorException({});
          }),
          // The above should never actually emit a value; it either results
          // in an error, or completes empty. Though typing does not match which 
          // we actually wish to return; discard the return types.
          ignoreElements(),
          // If we have reached this point, everything should have gone
          // correctly, so we can return the validated API response.
          concatWith(of(data))
        );
      }),
      // TODO: Maybe use switch instead. 
      switchAll(),
      map(value => {
        return plainToInstance(WeatherDto, {
          wind: value.wind.speed,
          temperature: value.main.temp,
        })
      }),
    );
  }

  private getCachedWeatherFor(name: string) {
    return from(this.weather.findOne({ name}));
  }

  public retrieve(name: string) {
    return this.getCurrentWeatherFor(name);
  }

  public findOne(name: string) {
    this.getCachedWeatherFor(name).pipe(
    )
  }

  private updateOne(name: string): Observable<void> {

    return this.getCurrentWeatherFor(name).pipe(
      single(),
      map(weather => {
        return from(this.weather.save({ 
          weather: { 
            temperature: weather.temperature,
            wind: weather.wind,
          }
        })).pipe(
          tap(value => this.logger.verbose(`Updated weather for [${name}].`))
        );
      }),
      switchAll(),
      // This observable solely performs side-effects; emitting
      // any values is somewhat useless.
      ignoreElements()
    );
  }

  public updateAll() {

    const requiresUpdate$ = from(this.weather.find({
      order: { lastUpdated: "ASC" } 
    }));

    // The number of requests that can be made to OpenWeatherMap's API
    // is limited. Prevent requests from being sent out as quickly as
    // possible as way to hopefully stay under this limit.
    const batchInterval = this.config.get<number>("updateBatchInterval", 60 * 1000);
    // When a large amount of data is stored in the database, the limit
    // could be quickly reached each time an update is being performed.
    // By limiting the number of requests made during an update, the use
    // can still use the other APIs.
    const maxBatchSize = this.config.get<number>("updateBatchCount", 20);

    return requiresUpdate$.pipe(
      // YAGNI: Allow for streaming the result from the server.
      concatAll(),
      bufferCount(maxBatchSize),
      concatMap(values => {
        return from(values).pipe(
          map(value => this.updateOne(value.name)),
          delay(batchInterval),
        );
      }),
    );
  }
}