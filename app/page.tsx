"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { WeightDisplay } from "@/components/WeightDisplay";
import { setAllState } from "@/store/workoutSlice";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { formatTime } from "@/components/WorkoutTimer";
import { liftOrder } from "@/types/workout";

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const state = useAppSelector((state) => state.workout);
    const trainingMaxes = state.maxes;
    const currentWeek = state.currentWeek;
    const currentLift = state.currentLift;
    const weightsInitialized = Object.values(trainingMaxes).every(
        (weight) => weight > 0,
    );
    const workoutHistory = useAppSelector((state) => state.workout.history);
    const workoutDays = Object.keys(workoutHistory).slice(-10).reverse();

    const weekDisplay =
        currentWeek === 4 ? "Deload Week" : `Week ${currentWeek}`;

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(state)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "531-workout-data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const state = JSON.parse(e.target?.result as string);
                        dispatch(setAllState(state));
                    } catch {
                        alert("Invalid file format");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const getTodayWorkout = () => {
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        return workoutHistory[today];
    };

    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 bg-gray-50 relative">
            <header className="text-center py-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    5/3/1 Workout Tracker
                </h1>
                <p className="mt-2 text-gray-600">
                    Simplifying your strength journey
                </p>
            </header>

            <main className="flex flex-col gap-8 items-center justify-center">
                <div className="max-w-md w-full space-y-6">
                    {weightsInitialized ? (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Your Program - {weekDisplay}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {liftOrder.map((lift) => (
                                    <div
                                        key={lift}
                                        className={`p-4 bg-white rounded-lg shadow-md relative ${
                                            lift === currentLift
                                                ? "ring-2 ring-blue-500"
                                                : ""
                                        }`}
                                    >
                                        {lift === currentLift && (
                                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                Up Next
                                            </span>
                                        )}
                                        <h3 className="text-lg font-medium capitalize">
                                            {lift}
                                        </h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            <WeightDisplay
                                                weight={trainingMaxes[lift]}
                                            />
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {getTodayWorkout() ? (
                                <div className="w-full p-4 bg-green-500 text-white rounded-lg shadow-md text-center">
                                    <p className="text-xl font-bold">
                                        🎉 Today's Workout Complete! 🎉
                                    </p>
                                    {getTodayWorkout().duration > 0 && (
                                        <p className="text-sm mt-1">
                                            Duration:{" "}
                                            {formatTime(
                                                getTodayWorkout().duration,
                                            )}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => router.push("/workout")}
                                    className="w-full p-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                                >
                                    Start Workout
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    router.push("/onboarding/existing")
                                }
                                className="w-full p-4 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                Edit Program
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push("/onboarding/new")}
                                className="w-full p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                            >
                                <h2 className="text-xl font-semibold">
                                    I&apos;m New to 5/3/1
                                </h2>
                                <p className="mt-2 text-sm opacity-90">
                                    Get started with a guided setup and learn
                                    the program basics
                                </p>
                            </button>

                            <button
                                onClick={() =>
                                    router.push("/onboarding/existing")
                                }
                                className="w-full p-6 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                <h2 className="text-xl font-semibold">
                                    I Know My Numbers
                                </h2>
                                <p className="mt-2 text-sm opacity-90">
                                    Jump right in with your existing training
                                    maxes
                                </p>
                            </button>
                        </>
                    )}

                    {weightsInitialized && workoutDays.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Recent Workouts
                            </h2>
                            <div className="space-y-2">
                                {workoutDays.map((day) => {
                                    const workout = workoutHistory[day];
                                    const mainSets = workout.mainSets;

                                    return (
                                        <button
                                            key={day}
                                            onClick={() =>
                                                router.push(`/workout/${day}`)
                                            }
                                            className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-1">
                                                        {[0, 1, 2].map(
                                                            (index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`w-6 h-6 flex items-center justify-center rounded-md ${
                                                                        mainSets.failed.includes(
                                                                            index,
                                                                        )
                                                                            ? "bg-red-200 text-red-800"
                                                                            : mainSets.completed.includes(
                                                                                    index,
                                                                                )
                                                                              ? "bg-green-200 text-green-800"
                                                                              : "bg-gray-200 text-gray-400"
                                                                    }`}
                                                                >
                                                                    {mainSets.failed.includes(
                                                                        index,
                                                                    ) ? (
                                                                        <Cross1Icon className="w-4 h-4" />
                                                                    ) : (
                                                                        <CheckIcon className="w-4 h-4" />
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium capitalize">
                                                            {workout.lift}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(
                                                                workout.date,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5 text-gray-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <div className="fixed bottom-4 right-4 flex gap-2">
                <button
                    onClick={handleImport}
                    className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    title="Import Data"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                    </svg>
                </button>
                <button
                    onClick={handleExport}
                    className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    title="Export Data"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                </button>
            </div>

            <footer className="text-center py-4 text-gray-500">
                <p className="text-sm">Built for lifters, by lifters</p>
            </footer>
        </div>
    );
}
