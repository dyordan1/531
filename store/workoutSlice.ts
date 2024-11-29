import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Lift, Maxes } from "@/types/workout";

interface WorkoutState {
    maxes: Maxes;
    weightUnit: "lbs" | "kg";
    currentLift: Lift;
    currentWeek: number;
    isOnboarded: boolean;
    preferredAssistance: {
        squat: string[];
        bench: string[];
        deadlift: string[];
        press: string[];
    };
}

const initialState: WorkoutState = {
    maxes: {
        squat: 0,
        bench: 0,
        deadlift: 0,
        press: 0,
    },
    weightUnit: "lbs",
    currentLift: "squat",
    currentWeek: 1,
    isOnboarded: false,
    preferredAssistance: {
        squat: ["Leg Press", "Leg Curls"],
        bench: ["Dumbbell Chest Press", "Dumbbell Rows"],
        deadlift: ["Good Mornings", "Hanging Leg Raises"],
        press: ["Dip", "Chin-Ups"],
    },
};

const workoutSlice = createSlice({
    name: "workout",
    initialState,
    reducers: {
        setMaxes: (state, action: PayloadAction<Maxes>) => {
            state.maxes = action.payload;
            state.isOnboarded = true;
        },
        setWeightUnit: (state, action: PayloadAction<"lbs" | "kg">) => {
            state.weightUnit = action.payload;
        },
        setCurrentWeek: (state, action: PayloadAction<number>) => {
            state.currentWeek = action.payload;
        },
        setCurrentLift: (state, action: PayloadAction<Lift>) => {
            state.currentLift = action.payload;
        },
        togglePreferredAssistance: (
            state,
            action: PayloadAction<{ lift: Lift; exercise: string }>,
        ) => {
            const { lift, exercise } = action.payload;
            const exercises = state.preferredAssistance[lift];

            if (exercises.includes(exercise)) {
                state.preferredAssistance[lift] = exercises.filter(
                    (e) => e !== exercise,
                );
            } else if (exercises.length < 3) {
                state.preferredAssistance[lift] = [...exercises, exercise];
            }
        },
    },
});

export const {
    setMaxes,
    setWeightUnit,
    setCurrentWeek,
    setCurrentLift,
    togglePreferredAssistance,
} = workoutSlice.actions;
export default workoutSlice.reducer;
