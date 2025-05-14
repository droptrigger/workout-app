/**
 * Интерфейс упражнения в шаблоне
 */
export interface Exercise {
    id: number;
    pattern_id: number,
    exercise: string;
}

/**
 * Интерфейс шаблона тренировки
 */
export interface Pattern {
    id: number;
    name: string;
    exercises: Exercise[];
}

/**
 * Интерфейс упражнения в тренировке
 */
export interface WorkoutExercise {
    id: number,
    workout_id: number;
    exercise: string;
    done: boolean;
}

/**
 * Интерфейс тренировки
 */
export interface Workout {
    id: number;
    date: string;
    pattern_id: number;
    name: string;
    exercises: WorkoutExercise[];
}


export interface ProfileStats {
    totalWorkouts: number;
}

export type WorkoutRouteParams = {
  patternId?: number;
};