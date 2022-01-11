import { Injectable, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  private readonly client: ClientProxy;

  constructor(
    @Inject() client: ClientProxy,
  ) {
    this.client = client;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateWeather() {
    this.logger.debug("Start updating weather data");
  }
}