import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { WeatherService } from "./weather.service";

@Controller()
export class WeatherController {

  private readonly weather: WeatherService;

  constructor(weather: WeatherService) {
    this.weather = weather;

  }

  @MessagePattern({ cmd: "store" })
  store(data: string) {
    
  }

  @MessagePattern({ cmd: "retrieve" })
  retieve(data: string) {

  }

  @MessagePattern({ cmd: "update" })
  update() {
    
  }

}