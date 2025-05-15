import { getDB } from "./db";
import { Workout, WorkoutExercise } from "../types/types";

/**
 * Асинхронное создание тренировки
 * @param date Дата тренировки
 * @param pattern_id Идентификатор шаблона тренировки
 * @param name Название тренировки
 * @param exercises Упражнения в тренировки
 * @returns Идентификатор тренировки
 */
export const createWorkout = async (
    date: string,
    pattern_id: number,
    name: string,
    exercises: string[]
): Promise<number> => {
    const db = getDB();
    const result = await db.runAsync(
        'INSERT INTO workouts (date, pattern_id, name) VALUES (?, ?, ?);',
        date,
        pattern_id,
        name
    );
    const workoutId = result.lastInsertRowId;

    for (const ex of exercises) {
        await db.runAsync(
            'INSERT INTO exercise_workouts (workout_id, exercise, done) VALUES (?, ?, 0);',
            workoutId,
            ex
        );
    }

    return workoutId;
}

/**
 * Асихнронное получения тренировок по дате
 * @param date Дата
 * @returns Массив тренировок
 */
export const getWorkoutsByDate = async (date: string): Promise<Workout[]> => {
    const db = getDB();
    const workouts = await db.getAllAsync<Omit<Workout, 'exercises'>>(
        'SELECT * FROM workouts WHERE date = ?;',
        date
    );

    const fullWorkouts: Workout[] = [];

    for (const workout of workouts) {
        const exercises = await db.getAllAsync<WorkoutExercise>(
            'SELECT * FROM exercise_workouts WHERE workout_id = ?;',
            [workout.id]
        );

        fullWorkouts.push({
            ...workout,
            exercises
        });
    }

    return fullWorkouts;
}

/**
 * Асинхронное удаление тренировки
 * @param id Идентификатор тренировки
 */
export const deleteWorkout = async (id: number) => {
    const db = getDB();
    await db.runAsync('DELETE FROM workouts WHERE id = ?', id);
};

/**
 * Асинхронное отметка упражнения как выполненное
 * @param id Идентификатор упражнения
 * @param done True - если выполнено
 */
export const toggleExerciseDone = async (
    id: number,
    done: boolean
) => {
    const db = getDB();
    await db.runAsync(
        'UPDATE exercise_workouts SET done = ? WHERE id = ?;',
        [
            done ? 1 : 0, 
            id
        ]
    )
}
