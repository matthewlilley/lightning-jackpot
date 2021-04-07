import { kpi as keyPerformanceIndicators } from "../../jobs/kpi";
import { createConnection } from "typeorm";
import { getDatabaseConfig } from "../../config";

export async function kpi({ input, flags }) {
  const config = await getDatabaseConfig();
  await createConnection(config);
  await keyPerformanceIndicators();
  process.exit(0);
}
