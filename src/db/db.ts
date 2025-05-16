import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { applyMigrations } from './migrations';

let db: SQLiteDatabase;

export const initDB = async () => {
  db = await openDatabaseAsync('trainer.db');
  await db.execAsync(`PRAGMA foreign_keys = ON;`);
  await applyMigrations(db);
};

export const getDB = () => {
  if (!db) throw new Error('База данных не инициализирована');
  return db;
};