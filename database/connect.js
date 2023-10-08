// db.mjs
import { QuickDB, MySQLDriver } from 'quick.db';
import config from './../config/config.json' assert { type: "json" };
import logger from './../logger.js';

let quickDB;

async function getDB() {
  if (!quickDB) {
    if (config.settings.mysql) {
      try {
        const mysql = new MySQLDriver({
          host: config.mysql.host,
          port: config.mysql.port,
          user: config.mysql.user,
          password: config.mysql.password,
          database: config.mysql.database
        });
        await mysql.connect();
        logger.info("Connected To Database");
        quickDB = new QuickDB({ driver: mysql });
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      quickDB = new QuickDB({ filePath: './database/database.sqlite' });
      logger.info("Connected To Database");
    }
  }
  return quickDB;
}

export default getDB;
