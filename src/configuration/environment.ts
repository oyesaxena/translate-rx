import dotenv from 'dotenv';
import logger from '../util/Logger';

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'prod') {
  logger.info('Starting PRODUCTION server');
} else if (process.env.NODE_ENV === 'uat') {
  logger.info('Starting UAT server');
} else if (process.env.NODE_ENV === 'test') {
  const configPath = '.env.test';
  logger.info('Starting Test server');
  dotenv?.config({ path: configPath });
} else {
  const configPath = '.env.local';
  logger.info('Starting LOCAL server');
  logger.info(
    `Configurations: ${JSON.stringify(dotenv?.config({ path: configPath })?.parsed, null, 4)}`,
  );
}

interface IAccount {
  name: string;
  token: string;
  service_account: Record<string, string>;
}

export const costPerChar = process.env.COST_PER_CHAR as unknown as number;
export const tokenSecret = process.env.TOKEN_SECRET;
const accountsList = JSON.parse(
  process.env.ACCOUNTS.replace(/\\\"/g, '"'),
) as unknown as IAccount[];

export const tokens = accountsList.map((acc) => acc.token);
export const accounts = accountsList.map((account) => ({
  name: account.name,
  service_acount: {
    ...account.service_account,
    private_key: account.service_account.private_key.replace(/\\n/g, '\n'),
  },
}));
