"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { WeightDisplay } from "@/components/WeightDisplay";
import { WeightUnitToggle } from "@/components/WeightUnitToggle";
import type { WorkoutSet } from "@/types/workout";
import { useState, useEffect } from "react";
import { togglePreferredAssistance } from "@/store/workoutSlice";
import {
    CheckIcon,
    Cross1Icon,
    PlayIcon,
    StopIcon,
} from "@radix-ui/react-icons";

function getWorkoutSets(week: number): WorkoutSet[] {
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleAssistanceToggle = (exercise: string) => {
        dispatch(
            togglePreferredAssistance({
                lift: currentLift,
                exercise,
            }),
        );
    };

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="space-y-2">
                    <button
                        onClick={() => router.push("/")}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 capitalize">
                        {currentLift} Day - {weekDisplay}
                    </h1>
                </header>

                <section className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            (Optional) Workout Timer
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-mono">
                                {formatTime(elapsedTime)}
                            </span>
                            <button
                                onClick={() => {
                                    if (!isTimerRunning) {
                                        setElapsedTime(0);
                                    }
                                    setIsTimerRunning(!isTimerRunning);
                                }}
                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                    isTimerRunning
                                        ? "bg-red-200 text-red-800 hover:bg-red-300"
                                        : "bg-green-200 text-green-800 hover:bg-green-300"
                                }`}
                            >
                                {isTimerRunning ? (
                                    <StopIcon className="w-5 h-5" />
                                ) : (
                                    <PlayIcon className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </section>

                <div className="space-y-8">
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Assistance Work
                            </h2>
                            <button
                                onClick={() =>
                                    setShowAllAssistance(!showAllAssistance)
                                }
                                className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                                {showAllAssistance
                                    ? "Show Preferred"
                                    : "See All Options"}
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {displayedAssistance.map((exercise, index) => (
                                <li
                                    key={index}
                                    className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                                >
                                    {preferredAssistance.includes(exercise) && (
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
                                                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                            }`}
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleAssistanceToggle(exercise)
                                        }
                                        className={`flex-1 flex justify-between items-center ${
                                            preferredAssistance.includes(
                                                exercise,
                                            )
                                                ? "text-blue-600"
                                                : ""
                                        }`}
                                    >
                                        <span>{exercise}</span>
                                        {preferredAssistance.includes(
                                            exercise,
                                        ) && (
                                            <span className="text-blue-500">
                                                ★
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {showAllAssistance ? (
                            <p className="text-gray-600 text-sm mt-4">
                                Click to select up to 3 preferred exercises
                            </p>
                        ) : (
                            <p className="text-gray-600 text-sm mt-4">
                                Perform 50-75 total reps of your preferred
                                exercises at a moderate intensity. This is your
                                warmup.
                            </p>
                        )}
                    </section>
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Main Sets
                        </h2>
                        <div className="space-y-4">
                            {workoutSets.map((set, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    toggleSetCompletion(index)
                                                }
                                                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                                    completedSets.includes(
                                                        index,
                                                    )
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                                }`}
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    toggleSetFailure(index)
                                                }
                                                className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                                    failedSets.includes(index)
                                                        ? "bg-red-200 text-red-800"
                                                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                                }`}
                                            >
                                                <Cross1Icon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <span className="text-lg font-medium">
                                            Set {index + 1}
                                        </span>
                                        <span className="text-gray-600">
                                            ({Math.round(set.percentage * 100)}
                                            %)
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            <WeightDisplay
                                                weight={set.weight}
                                            />
                                        </div>
                                        <div className="text-gray-600">
                                            {set.reps} reps
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <WeightUnitToggle />
        </div>
    );
}
