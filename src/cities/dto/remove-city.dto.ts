import { IsMongoId } from "class-validator";

export class RemoveCityDto {
  @IsMongoId()
  public readonly id: string = "";

  
}