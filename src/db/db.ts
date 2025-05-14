import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

/**
 * Объект базы данных
 */
let db: SQLiteDatabase;

/**
 * Асинхронный метод инициализации базы данных
 */
export const initDB = async () => {
    db = await openDatabaseAsync('trainer.db');

    await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS patterns_workout (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS patterns_exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pattern_id INTEGER NOT NULL,
            exercise TEXT NOT NULL,
            FOREIGN KEY (pattern_id) REFERENCES patterns_workout(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            pattern_id INTEGER NOT NULL,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS exercise_workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER NOT NULL,
            exercise TEXT NOT NULL,
            done INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
        );
    `);
};

/**
 * Метод получения объекта базы данных
 * @returns Объект базы данных
 */
export const getDB = () => {
    if (!db) 
        throw new Error('База данных не инициализирована. Вызовите initDB()!');
    
    return db;
}