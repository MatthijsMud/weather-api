import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { TasksService } from "./tasks.service";

@Module({
  imports: [ClientsModule.register([{ name: "WEATHER_UPDATER_SERVICE" }])],
  providers: [TasksService]
})
export class TasksModule {};