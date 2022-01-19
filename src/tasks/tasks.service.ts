import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  private readonly client: ClientProxy;

  private busyUpdating?: Promise<unknown> | undefined;

  constructor(
    @Inject("WEATHER_UPDATER_SERVICE") client: ClientProxy,
  ) {
    this.client = client;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateWeather() {
    if (this.busyUpdating) {
      this.logger.warn("Updating all cities took longer than the time between updates.");
      return;
    }
    try {
      this.logger.log("Start updating weather data.");
      
      this.busyUpdating = lastValueFrom(this.client.send({ cmd: "update" }, {}));
      await this.busyUpdating;
      this.busyUpdating = undefined;
      
      this.logger.log("Finished updating weather data.");
    }
    catch (exception) {
      this.logger.error("Error occurred while updating weather data.");
    }
  }
}