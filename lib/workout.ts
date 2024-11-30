import type { WorkoutSet } from "@/types/workout";

export function getWorkoutSets(week: number): WorkoutSet[] {
    switch (week) {
        case 1:
            return [
                { percentage: 0.65, reps: 5, weight: 0 },
                { percentage: 0.75, reps: 5, weight: 0 },
                { percentage: 0.85, reps: 5, weight: 0 },
            ];
        case 2:
            return [
                { percentage: 0.7, reps: 3, weight: 0 },
                { percentage: 0.8, reps: 3, weight: 0 },
                { percentage: 0.9, reps: 3, weight: 0 },
            ];
        case 3:
            return [
                { percentage: 0.75, reps: 5, weight: 0 },
                { percentage: 0.85, reps: 3, weight: 0 },
                { percentage: 0.95, reps: 1, weight: 0 },
            ];
        case 4: // Deload week
            return [
                { percentage: 0.4, reps: 5, weight: 0 },
                { percentage: 0.5, reps: 5, weight: 0 },
                { percentage: 0.6, reps: 5, weight: 0 },
            ];
        default:
            return [];
    }
}
