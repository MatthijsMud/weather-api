import { plainToClass } from "class-transformer";
import { IsPositive, IsNotEmpty, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsPositive()
  UPDATE_BATCH_COUNT: number = 0;

  @IsPositive()
  UPDATE_BATCH_INTERVAL: number = 0;

  @IsNotEmpty()
  WEATHER_API_KEY: string = "";
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
