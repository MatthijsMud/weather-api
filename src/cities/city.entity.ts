import { Entity, Column, PrimaryColumn, OneToMany, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class City {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  constructor(id: ObjectID) {
    this.id = id;
    this.name = "";
  }

}