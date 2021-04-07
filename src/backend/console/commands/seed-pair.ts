
import { seed } from '../../jobs/seed';
import { createConnection } from 'typeorm';
import { getDatabaseConfig } from '../../config';

export async function seedPair({ input, flags }) {
  const config = await getDatabaseConfig()
  await createConnection(config);
  await seed();
  process.exit(0);
}

