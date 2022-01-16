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

  @MessagePattern({ cmd: "create" })
  create(data: string) {
    return this.weather.create(data);

  }

  @MessagePattern({ cmd: "update" })
  update() {

  }

}