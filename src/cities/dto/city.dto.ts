import { } from "@nestjs/swagger";

export class CityDto {
  readonly name: string;

  public constructor(name: string) {
    this.name = name;
  }
}