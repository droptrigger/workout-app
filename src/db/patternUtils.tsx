import { Exercise, Pattern } from "../types/types";
import { getDB } from "./db";

/**
 * Асинхронное создание шаблона тренировки
 * @param name Название тренировки
 * @param exercises Упражнения тренировки
 */
export const createPattern = async (name: string, exercises: string[]): Promise<void> => {
    const db = getDB();
    const result = await db.runAsync(
        'INSERT INTO patterns_workout (name) VALUES (?);',
        name
    );
    const patternId = result.lastInsertRowId;

    for (const ex of exercises) {
        await db.runAsync(
            'INSERT INTO patterns_exercises (pattern_id, exercise) VALUES (?, ?);',
            patternId,
            ex
        );
    }
};

/**
 * Асинхронное получение всех шаблонов тренировки
 * @returns Массив шаблонов тренировок
 */
export const getAllPatterns = async (): Promise<Pattern[]> => {
    const db = getDB();
    const rawPatterns = await db.getAllAsync<Pick<Pattern, 'id' | 'name'>>(
        'SELECT id, name FROM patterns_workout;'
    );

    const result: Pattern[] = [];

    for (const pattern of rawPatterns) {
        const exercises = await db.getAllAsync<Omit<Exercise, 'pattern_id'>>(
            'SELECT id, exercise FROM patterns_exercises WHERE pattern_id = ?;',
            [pattern.id]
        );

        const exercisesWithPatternId: Exercise[] = exercises.map((ex) => ({
            ...ex,
            pattern_id: pattern.id,
        }));

        result.push({
            id: pattern.id,
            name: pattern.name,
            exercises: exercisesWithPatternId,
        });
    }

    return result;
};

/**
 * Асинхронное получение всех упражнений из шаблона тренировки
 * @param patternId Идентификатор шаблона тренировки
 * @returns Массив упражнений
 */
export const getPatternWithExercises = async (
    patternId: number
): Promise<Exercise[]> => {
    const db = getDB();
    const exercises = await db.getAllAsync<Omit<Exercise, 'pattern_id'>>(
        'SELECT id, exercise FROM patterns_exercises WHERE pattern_id = ?;',
        [patternId]
    );

    return exercises.map((ex) => ({
        ...ex,
        pattern_id: patternId,
    }));
};

/**
 * Асинронное получение шаблона тренировки по ID
 * @param patternId Идентификатор
 * @returns Найденный шаблон
 */
export const getPatternById = async (patternId: number): Promise<Pattern> => {
    const db = getDB();

    const pattern = await db.getFirstAsync<Pick<Pattern, 'id' | 'name'>>(
        'SELECT id, name FROM patterns_workout WHERE id = ?',
        [patternId]
    );

    if (!pattern) {
        throw new Error(`Шаблон с ID ${patternId} не найден`);
    }

    const exercises = await db.getAllAsync<Omit<Exercise, 'pattern_id'> & { id: number }>(
        'SELECT id, exercise FROM patterns_exercises WHERE pattern_id = ?',
        [patternId]
    );

    const exercisesWithPatternId: Exercise[] = exercises.map(ex => ({
        ...ex,
        pattern_id: pattern.id
    }));

    return {
        ...pattern,
        exercises: exercisesWithPatternId
    };
};

/**
 * Асинхронное обновления шаблона тренировки
 * @param id Идентификатор шаблона
 * @param name Название шаблона
 * @param exercises Массив упражнений
 */
export const updatePattern = async (
    id: number,
    name: string,
    exercises: string[]
): Promise<void> => {
    const db = getDB();

    await db.runAsync('UPDATE patterns_workout SET name = ? WHERE id = ?;', name, id);
    await db.runAsync('DELETE FROM patterns_exercises WHERE pattern_id = ?;', id);

    for (const ex of exercises) {
        await db.runAsync(
            'INSERT INTO patterns_exercises (pattern_id, exercise) VALUES (?, ?);',
            id,
            ex
        );
    }
};

/**
 * Асинхронное удаление шаблона тренировки из базы данных
 * @param id Идентификатор шаблона
 */
export const deletePattern = async (id: number): Promise<void> => {
    const db = getDB();
    await db.runAsync('DELETE FROM patterns_workout WHERE id = ?;', id);
};