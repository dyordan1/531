export type Lift = "squat" | "bench" | "deadlift" | "press";

export interface Maxes {
    squat: number;
    bench: number;
    deadlift: number;
    press: number;
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
