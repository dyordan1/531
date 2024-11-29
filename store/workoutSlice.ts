import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Lift, Maxes } from "@/types/workout";

interface WorkoutState {
    maxes: Maxes;
    weightUnit: "lbs" | "kg";
    currentLift: Lift;
    currentWeek: number;
    isOnboarded: boolean;
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
    },
});

export const { setMaxes, setWeightUnit, setCurrentWeek, setCurrentLift } =
    workoutSlice.actions;
export default workoutSlice.reducer;
