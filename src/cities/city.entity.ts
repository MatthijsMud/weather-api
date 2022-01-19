import { Entity, Column, PrimaryColumn, OneToMany, ObjectID, ObjectIdColumn, OneToOne, UpdateDateColumn } from "typeorm";

class Weather {

  @Column()
  temperature!: number;

  @Column()
  wind!: number;
}

@Entity()
export class City {

  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  name!: string;

  @Column(() => Weather)
  weather!: Weather;

  @UpdateDateColumn()
  lastUpdated!: Date;

}