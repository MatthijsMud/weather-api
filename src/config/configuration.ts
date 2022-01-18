
export const configuration = () => {
  return {
    updateBatchCount: parseInt(process.env["UPDATE_BATCH_COUNT"]!) || 20,
    updateBatchInterval: parseInt(process.env["UPDATE_BATCH_INTERVAL"]!) || 60 * 1000, // seconds
    weatherApiKey: process.env["WEATHER_API_KEY"] || "", // Cannot provide a meaningful default
  };
}
