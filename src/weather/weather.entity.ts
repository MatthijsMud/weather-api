import { Entity, Column, PrimaryColumn, OneToOne, ObjectID, ObjectIdColumn, UpdateDateColumn  } from "typeorm";
import { City } from "../cities/city.entity";

@Entity()
export class Weather {
  
  @ObjectIdColumn()
  id: ObjectID = null!; // Instances should only be instantiated by the ORM.

  @Column()
  temperature: number = 0;

  @Column()
  humidity: number = 0;

  @UpdateDateColumn()
  lastUpdated: Date = null!;

  @OneToOne(type => City)
  weatherFor: City = null!;
}