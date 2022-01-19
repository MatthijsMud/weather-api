import { IsObject, IsNumber, IsString, ValidateNested } from "class-validator";

class Temperature {
  /** Given in Kelvin by default; treat it differently if requesting Celcius of Fahrenheit instead. */
  @IsNumber()
  temp?: number;
}

class Wind {
  @IsNumber()
  speed?: number;
}

/**
 * Partial class representing the response from OpenWeatherMap's API.
 * 
 * As this is just a proof-of-concept application, not all fields
 * that might acutally be returned are declared.
 */
export class FromOpenWeatherMapDto {
  
  @ValidateNested()
  main?: Temperature;

  @ValidateNested()
  wind?: Wind;
}