import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCityDto {
  @IsString()
  public readonly name: string = "";
}