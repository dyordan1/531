import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";
import { liftOrder, type Lift, type Maxes } from "@/types/workout";

const getIncrease = (lift: Lift) => {
    switch (lift) {
        case "press":
        case "bench":
            return 5;
        case "deadlift":
        case "squat":
            return 10;
    }
};

interface WorkoutHistoryEntry {
    date: string;
    lift: Lift;
    week: number;
    duration: number; // seconds
    trainingMax: number;
    selectedAssistance: string[];
    completedAssistance: string[];
    mainSets: {
        completed: number[];
        failed: number[];
    };
}

interface WorkoutState {
    maxes: Maxes;
    shouldIncrease: Record<Lift, boolean>;
    weightUnit: "lbs" | "kg";
    currentLift: Lift;
    currentWeek: number;
    preferredAssistance: {
        squat: string[];
        bench: string[];
        deadlift: string[];
        press: string[];
    };
    history: Record<string, WorkoutHistoryEntry>;
}

const initialState: WorkoutState = {
    maxes: {
        squat: 0,
        bench: 0,
        deadlift: 0,
        press: 0,
    },
    shouldIncrease: {
        squat: true,
        bench: true,
        deadlift: true,
        press: true,
    },
    weightUnit: "lbs",
    currentLift: "press",
    currentWeek: 1,
    preferredAssistance: {
        squat: ["Leg Press", "Leg Curls"],
        bench: ["Dumbbell Chest Press", "Dumbbell Rows"],
        deadlift: ["Good Mornings", "Hanging Leg Raises"],
        press: ["Dip", "Chin-Ups"],
    },
    history: {},
};

const workoutSlice = createSlice({
    name: "workout",
    initialState,
    reducers: {
        setMaxes: (state, action: PayloadAction<Maxes>) => {
            state.maxes = action.payload;
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
        setAllState: (state, action: PayloadAction<WorkoutState>) => {
            for (const key in state) {
                if (key in action.payload) {
                    // @ts-expect-error This will mostly work
                    state[key] = action.payload[key];
                }
            }
        },
        recordWorkout: (
            state,
            action: PayloadAction<{
                duration: number;
                selectedAssistance: string[];
                completedAssistance: string[];
                completedSets: number[];
                failedSets: number[];
            }>,
        ) => {
            const now = new Date();
            const today = new Date()
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const entry: WorkoutHistoryEntry = {
                date: now.toISOString(),
                lift: state.currentLift,
                week: state.currentWeek,
                duration: action.payload.duration,
                trainingMax: state.maxes[state.currentLift],
                selectedAssistance:
                    state.preferredAssistance[state.currentLift],
                completedAssistance: action.payload.completedAssistance,
                mainSets: {
                    completed: action.payload.completedSets,
                    failed: action.payload.failedSets,
                },
            };
            state.shouldIncrease[state.currentLift] =
                state.shouldIncrease[state.currentLift] &&
                action.payload.failedSets.length === 0;
            state.history[today] = entry;
            const currentLiftIndex = liftOrder.indexOf(state.currentLift);
            state.currentLift =
                liftOrder[(currentLiftIndex + 1) % liftOrder.length];
            if (currentLiftIndex === liftOrder.length - 1) {
                state.currentWeek += 1;
                if (state.currentWeek > 4) {
                    state.currentWeek = 1;
                    for (const lift of liftOrder) {
                        if (state.shouldIncrease[lift]) {
                            state.maxes[lift] =
                                state.maxes[lift] + getIncrease(lift);
                        }
                        state.shouldIncrease[lift] = true;
                    }
                }
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
    recordWorkout,
} = workoutSlice.actions;
export const setAllState = createAction<{
    maxes: Record<string, number>;
    currentWeek: number;
    currentLift: string;
}>("workout/setAllState");
export default workoutSlice.reducer;
