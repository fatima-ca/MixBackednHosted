import sql from 'mssql';
import { dbConfig } from '@/config/db';

const user = dbConfig.user;
const password = dbConfig.password;
const server = dbConfig.server;
const database = dbConfig.database;

if (!user || !password || !server || !database) {
  throw new Error('Missing required database environment variables.');
}

const config: sql.config = {
  user: user,
  password: password,
  server: server,
  database: database,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

if (!poolPromise) {
  poolPromise = sql.connect(config);
}

export default config;
export const pool = poolPromise;
export { sql };