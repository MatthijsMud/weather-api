import { Controller, Logger } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { WeatherService } from "./weather.service";

@Controller()
export class WeatherController {

  private readonly logger = new Logger(WeatherService.name);
  private readonly weather: WeatherService;

  constructor(weather: WeatherService) {
    this.logger.log("Created weather controller");
    this.weather = weather;

  }

  @MessagePattern({ cmd: "store" })
  store(data: string) {
    
  }

  @MessagePattern({ cmd: "retrieve" })
  retrieve(data: string) {
    return this.weather.retrieve(data);

  }

  @MessagePattern({ cmd: "update" })
  update() {

  }

}