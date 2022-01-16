import { } from "@nestjs/swagger";

export class City {
  readonly name: string;

  public constructor(name: string) {
    this.name = name;
  }
}