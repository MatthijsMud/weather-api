import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  private readonly client: ClientProxy;

  constructor(
    @Inject("WEATHER_UPDATER_SERVICE") client: ClientProxy,
  ) {
    this.client = client;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateWeather() {
    try {
      this.logger.log("Start updating weather data");
      await lastValueFrom(this.client.send({ cmd: "update" }, {}));
      this.logger.error("Error occurred while updating weather data");
    }
    catch (exception) {
      this.logger.error("Error occurred while updating weather data");
    }
  }
}