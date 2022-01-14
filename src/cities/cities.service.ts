import { Injectable, Inject, } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Repository, getConnection, ObjectID } from "typeorm";
import { Observable, from, of, } from "rxjs";
import { switchMap, concatAll } from "rxjs/operators";

import { City } from "./city.entity";

@Injectable()
export class CitiesService {
  
  private readonly http: HttpService;
  private readonly city: Repository<City>;
  
  public constructor (
    http: HttpService, 
    @InjectRepository(City)
    city: Repository<City>
  ) {
    this.http = http;
    this.city = city;
  }

  public findOne(name: string): Observable<City> {
    return from(this.city.findOne({ name })).pipe(
      switchMap(value => value 
        ? of(value)
        : this.city.save(this.city.create())
      )
    );
  }

  public findAll(): Observable<City> {
    return from(this.city.find()).pipe(
      concatAll()
    );
  }
}