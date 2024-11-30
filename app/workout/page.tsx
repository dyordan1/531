"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { formatTime, WorkoutTimer } from "@/components/WorkoutTimer";
import { WorkoutSets } from "@/components/WorkoutSets";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
    togglePreferredAssistance,
    recordWorkout,
    setCurrentWeek,
    setCurrentLift,
} from "@/store/workoutSlice";
import { getWorkoutSets } from "@/lib/workout";
import { CheckIcon } from "@radix-ui/react-icons";
import { Lift } from "@/types/workout";
import { WorkoutDisplay } from "@/components/WorkoutDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function getAssistanceWork(lift: string): string[] {
    switch (lift) {
        case "squat":
            return [
                "Leg Press",
                "Leg Curls",
                "Bulgarian Split Squats",
                "Leg Extensions",
                "Romanian Deadlifts",
                "Walking Lunges",
                "Calf Raises",
                "Goblet Squats",
                "Hip Thrusts",
                "Ab Wheel Rollouts",
            ];
        case "bench":
            return [
                "Dumbbell Chest Press",
                "Dumbbell Rows",
                "Incline Bench Press",
                "Close-Grip Bench Press",
                "Tricep Pushdowns",
                "Tricep Extensions",
                "Dips",
                "Push-Ups",
                "Lateral Raises",
                "Face Pulls",
                "Band Pull-Aparts",
            ];
        case "deadlift":
            return [
                "Good Mornings",
                "Hanging Leg Raises",
                "Back Extensions",
                "Barbell Rows",
                "Pull-Ups/Lat Pulldowns",
                "Face Pulls",
                "Planks",
                "Cable Rows",
                "Reverse Hyperextensions",
                "Farmer's Walks",
            ];
        case "press":
            return [
                "Dip",
                "Chin-Ups",
                "Dumbbell Shoulder Press",
                "Push Press",
                "Lateral Raises",
                "Front Raises",
                "Face Pulls",
                "Upright Rows",
                "Tricep Pushdowns",
                "Band Pull-Aparts",
                "Rear Delt Flies",
                "Shrugs",
            ];
        default:
            return [];
    }
}

export default function WorkoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showAllAssistance, setShowAllAssistance] = useState(false);
    const currentWeek = useAppSelector((state) => state.workout.currentWeek);
    const currentLift = useAppSelector((state) => state.workout.currentLift);
    const maxes = useAppSelector((state) => state.workout.maxes);
    const preferredAssistance = useAppSelector(
        (state) => state.workout.preferredAssistance[currentLift],
    );

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const todayWorkout = useAppSelector(
        (state) => state.workout.history[today],
    );

    const trainingMax = maxes[currentLift];
    const workoutSets = getWorkoutSets(currentWeek).map((set) => ({
        ...set,
        weight: Math.round(set.percentage * trainingMax),
    }));
    const allAssistanceWork = getAssistanceWork(currentLift);
    const displayedAssistance = showAllAssistance
        ? allAssistanceWork
        : preferredAssistance;

    const weekDisplay =
        currentWeek === 4 ? "Deload Week" : `Week ${currentWeek}`;

    const [completedSets, setCompletedSets] = useState<number[]>([]);
    const [failedSets, setFailedSets] = useState<number[]>([]);
    const [completedAssistance, setCompletedAssistance] = useState<string[]>(
        [],
    );
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isTimerRunning) {
            intervalId = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isTimerRunning]);

    const handleTimerToggle = () => {
        if (!isTimerRunning) {
            setElapsedTime(0);
        }
        setIsTimerRunning(!isTimerRunning);
    };

    const handleAssistanceToggle = (exercise: string) => {
        dispatch(
            togglePreferredAssistance({
                lift: currentLift,
                exercise,
            }),
        );
    };

    const isWorkoutComplete = useMemo(() => {
        return workoutSets.every(
            (_, index) =>
                completedSets.includes(index) || failedSets.includes(index),
        );
    }, [completedSets, failedSets, workoutSets]);

    const onWorkoutComplete = useCallback(() => {
        dispatch(
            recordWorkout({
                duration: elapsedTime,
                selectedAssistance: preferredAssistance,
                completedAssistance,
                completedSets,
                failedSets,
            }),
        );
    }, [elapsedTime, completedAssistance, completedSets, failedSets]);

    useEffect(() => {
        if (isWorkoutComplete) {
            setIsTimerRunning(false);
            onWorkoutComplete();
        }
    }, [isWorkoutComplete, onWorkoutComplete]);

    const toggleSetCompletion = (index: number) => {
        if (completedSets.includes(index)) {
            setCompletedSets((prev) => prev.filter((i) => i !== index));
        } else {
            setCompletedSets((prev) => [...prev, index]);
            setFailedSets((prev) => prev.filter((i) => i !== index));
        }
    };

    const toggleSetFailure = (index: number) => {
        if (failedSets.includes(index)) {
            setFailedSets((prev) => prev.filter((i) => i !== index));
        } else {
            setFailedSets((prev) => [...prev, index]);
            setCompletedSets((prev) => prev.filter((i) => i !== index));
        }
    };

    const toggleAssistanceCompletion = (exercise: string) => {
        setCompletedAssistance((prev) =>
            prev.includes(exercise)
                ? prev.filter((e) => e !== exercise)
                : [...prev, exercise],
        );
    };

    return (
        <>
            {todayWorkout !== undefined && <WorkoutDisplay date={today} />}
            {todayWorkout === undefined && (
                <div className="min-h-screen p-8">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <header className="space-y-2">
                            <Button
                                variant="link"
                                onClick={() => router.push("/")}
                            >
                                ← Back to Dashboard
                            </Button>
                            <h1 className="text-3xl font-bold text-primary capitalize">
                                {currentLift} Day - {weekDisplay}
                            </h1>
                        </header>

                        <Card className="p-6">
                            <WorkoutTimer
                                isRunning={isTimerRunning}
                                elapsedTime={elapsedTime}
                                onToggle={handleTimerToggle}
                            />
                        </Card>

                        <Card className="p-6">
                            <section className="rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Assistance Work
                                    </h2>
                                    <Button
                                        variant="link"
                                        onClick={() =>
                                            setShowAllAssistance(
                                                !showAllAssistance,
                                            )
                                        }
                                    >
                                        {showAllAssistance
                                            ? "Show Preferred"
                                            : "See All Options"}
                                    </Button>
                                </div>
                                <ul className="space-y-2">
                                    {displayedAssistance.map(
                                        (exercise, index) => (
                                            <li
                                                key={index}
                                                className="p-3 rounded-lg flex items-center gap-3"
                                            >
                                                {preferredAssistance.includes(
                                                    exercise,
                                                ) && (
                                                    <button
                                                        onClick={() =>
                                                            toggleAssistanceCompletion(
                                                                exercise,
                                                            )
                                                        }
                                                        className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                                            completedAssistance.includes(
                                                                exercise,
                                                            )
                                                                ? "bg-green-200 text-green-800"
                                                                : "bg-secondary text-secondary-foreground hover:bg-green-100"
                                                        }`}
                                                    >
                                                        <CheckIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleAssistanceToggle(
                                                            exercise,
                                                        )
                                                    }
                                                    className={`flex-1 flex justify-between items-center ${
                                                        preferredAssistance.includes(
                                                            exercise,
                                                        )
                                                            ? "text-primary"
                                                            : "text-muted-foreground"
                                                    }`}
                                                >
                                                    <span>{exercise}</span>
                                                    {preferredAssistance.includes(
                                                        exercise,
                                                    ) && (
                                                        <span className="text-primary">
                                                            ★
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        ),
                                    )}
                                </ul>
                                {showAllAssistance ? (
                                    <p className="text-secondary-foreground text-sm mt-4">
                                        Click to select up to 3 preferred
                                        exercises
                                    </p>
                                ) : (
                                    <p className="text-secondary-foreground text-sm mt-4">
                                        Perform 50-75 total reps of your
                                        preferred exercises at a moderate
                                        intensity. This is your warmup.
                                    </p>
                                )}
                            </section>
                        </Card>

                        <Card className="p-6">
                            <WorkoutSets
                                sets={workoutSets}
                                completedSets={completedSets}
                                failedSets={failedSets}
                                onToggleComplete={toggleSetCompletion}
                                onToggleFail={toggleSetFailure}
                                isDeloadWeek={currentWeek === 4}
                            />
                        </Card>
                    </div>
                </div>
            )}
            {!isWorkoutComplete && (
                <div className="bg-secondary fixed bottom-5 left-1/2 -translate-x-1/2 text-secondary-foreground py-4 px-8 text-center text-xl font-bold shadow-lg rounded-lg">
                    Workout pending...
                    {isTimerRunning && (
                        <span className="ml-2 font-mono">
                            ({formatTime(elapsedTime)})
                        </span>
                    )}
                </div>
            )}
            {isWorkoutComplete && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white py-4 px-8 text-center text-xl font-bold shadow-lg rounded-lg">
                    🎉 Workout Recorded! 🎉
                </div>
            )}
        </>
    );
}
