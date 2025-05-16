import { SQLiteDatabase } from 'expo-sqlite';
import * as m1 from './1_initial';

const CURRENT_DB_VERSION = 1;

const migrations = new Map<number, { up: (db: SQLiteDatabase) => Promise<void> }>([
  [1, m1],
]);

export const applyMigrations = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM meta WHERE key = ?',
    ['db_version']
  );

  let currentVersion = row?.value ? parseInt(row.value) : 0;

  while (currentVersion < CURRENT_DB_VERSION) {
    currentVersion++;
    const migration = migrations.get(currentVersion);
    if (migration) {
      console.log(`Applying migration v${currentVersion}`);
      await migration.up(db);
      await db.runAsync('REPLACE INTO meta (key, value) VALUES (?, ?)', [
        'db_version',
        String(currentVersion),
      ]);
    }
  }
};
