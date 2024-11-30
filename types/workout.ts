export type Lift = "press" | "deadlift" | "bench" | "squat";

export const liftOrder: Lift[] = ["press", "deadlift", "bench", "squat"];

export interface Maxes {
    press: number;
    deadlift: number;
    bench: number;
    squat: number;
}

export interface WorkoutSet {
    percentage: number;
    reps: number;
    weight: number;
}

export interface WorkoutDay {
    lift: Lift;
    sets: WorkoutSet[];
    assistance: string[];
}
