"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAllState } from "@/store/workoutSlice";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { formatTime } from "@/components/WorkoutTimer";
import { liftOrder } from "@/types/workout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { LiftCard } from "@/components/LiftCard";
import { useMemo } from "react";

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

    const getWorkoutStatus = (date: Date) => {
        const dateKey = date.toISOString().slice(0, 10).replace(/-/g, "");
        const workout = workoutHistory[dateKey];
        if (!workout) return null;
        return workout.mainSets.failed.length > 0 ? "failed" : "success";
    };

    const getMostRecentWorkoutDate = () => {
        if (workoutDays.length === 0) return new Date();

        const mostRecent = workoutDays[0];
        return new Date(
            parseInt(mostRecent.slice(0, 4)),
            parseInt(mostRecent.slice(4, 6)) - 1,
            parseInt(mostRecent.slice(6, 8)),
        );
    };

    const consecutiveWorkoutDays = useMemo(() => {
        let consecutiveDays = 0;

        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().slice(0, 10).replace(/-/g, "");
            if (workoutHistory[dateKey]) {
                consecutiveDays++;
            } else {
                break;
            }
        }
        return consecutiveDays;
    }, [workoutHistory]);

    return (
        <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 relative">
            <header className="text-center py-8">
                <h1 className="text-4xl font-bold">5/3/1 Workout Tracker</h1>
                <p className="mt-2 text-secondary-foreground">
                    Simplifying your strength journey
                </p>
            </header>

            <main className="flex flex-col gap-8 items-center justify-center">
                <div className="max-w-md w-full space-y-6">
                    {weightsInitialized ? (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-primary">
                                Your Program - {weekDisplay}
                            </h2>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {liftOrder.map((lift) => (
                                    <LiftCard
                                        key={lift}
                                        lift={lift}
                                        weight={trainingMaxes[lift]}
                                        isActive={lift === currentLift}
                                    />
                                ))}
                            </div>
                            {getTodayWorkout() ? (
                                <div className="w-full p-4 bg-green-500 text-primary rounded-lg shadow-md text-center">
                                    <p className="text-xl font-bold">
                                        🎉 Today&apos;s Workout Complete! 🎉
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
                                <>
                                    {consecutiveWorkoutDays >= 2 ? (
                                        <div className="space-y-2">
                                            <div className="w-full p-4 bg-red-100 text-red-800 rounded-lg text-center">
                                                {consecutiveWorkoutDays >= 7 ? (
                                                    <>
                                                        <p className="font-semibold">
                                                            Bro, slow down 🥵
                                                        </p>
                                                        <p className="text-sm">
                                                            It's been 7+ days
                                                            straight!
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold">
                                                            Consider taking a
                                                            rest day
                                                        </p>
                                                        <p className="text-sm">
                                                            You've trained{" "}
                                                            {
                                                                consecutiveWorkoutDays
                                                            }{" "}
                                                            days in a row
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    router.push("/workout")
                                                }
                                                className="w-full bg-red-500 hover:bg-red-600 whitespace-normal"
                                                size="lg"
                                            >
                                                {consecutiveWorkoutDays >= 7
                                                    ? "Yeah, Whatever. Lift. Trucks."
                                                    : "Start Workout Anyway"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                router.push("/workout")
                                            }
                                            className="w-full"
                                            size="lg"
                                        >
                                            Start Workout
                                        </Button>
                                    )}
                                </>
                            )}
                            <Button
                                onClick={() =>
                                    router.push("/onboarding/existing")
                                }
                                className="w-full"
                                size="lg"
                                variant="secondary"
                            >
                                Edit Program
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button
                                onClick={() => router.push("/onboarding/new")}
                                className="w-full h-auto py-6 flex flex-col items-center whitespace-normal"
                                size="lg"
                            >
                                <h2 className="text-xl sm:text-3xl font-semibold">
                                    I&apos;m New to 5/3/1
                                </h2>
                                <p className="mt-2 text-sm sm:text-base opacity-90">
                                    Get started with a guided setup and learn
                                    the program basics
                                </p>
                            </Button>

                            <Button
                                onClick={() =>
                                    router.push("/onboarding/existing")
                                }
                                className="w-full h-auto py-6 flex flex-col items-center whitespace-normal"
                                size="lg"
                                variant="secondary"
                            >
                                <h2 className="text-xl sm:text-3xl font-semibold">
                                    I Know My Numbers
                                </h2>
                                <p className="mt-2 text-sm sm:text-base opacity-90">
                                    Jump right in with your existing training
                                    maxes
                                </p>
                            </Button>
                        </>
                    )}

                    {weightsInitialized && workoutDays.length > 0 && (
                        <div className="space-y-4 w-full">
                            <h2 className="text-2xl font-semibold text-primary">
                                Workout History
                            </h2>

                            {/* Calendar for screens >= 480px */}
                            <div className="hidden min-[480px]:block rounded-md border w-full">
                                <Calendar
                                    mode="single"
                                    selected={new Date()}
                                    defaultMonth={getMostRecentWorkoutDate()}
                                    modifiers={{
                                        workout: (date) =>
                                            getWorkoutStatus(date) !== null,
                                    }}
                                    modifiersStyles={{
                                        workout: {
                                            fontWeight: "bold",
                                        },
                                    }}
                                    className="w-full"
                                    components={{
                                        DayContent: ({ date }) => {
                                            const status =
                                                getWorkoutStatus(date);
                                            return (
                                                <div
                                                    className={`w-full h-full flex items-center justify-center ${
                                                        status === "failed"
                                                            ? "bg-red-100 text-red-900"
                                                            : status ===
                                                                "success"
                                                              ? "bg-green-100 text-green-900"
                                                              : ""
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </div>
                                            );
                                        },
                                    }}
                                    onDayClick={(date) => {
                                        const dateKey = date
                                            .toISOString()
                                            .slice(0, 10)
                                            .replace(/-/g, "");
                                        if (workoutHistory[dateKey]) {
                                            router.push(`/workout/${dateKey}`);
                                        }
                                    }}
                                />
                            </div>

                            {/* List for screens < 480px */}
                            <div className="min-[480px]:hidden space-y-2">
                                {workoutDays.map((day) => {
                                    const workout = workoutHistory[day];
                                    const date = new Date(
                                        parseInt(day.slice(0, 4)),
                                        parseInt(day.slice(4, 6)) - 1,
                                        parseInt(day.slice(6, 8)),
                                    );
                                    const failed =
                                        workout.mainSets.failed.length > 0;

                                    return (
                                        <Button
                                            key={day}
                                            onClick={() =>
                                                router.push(`/workout/${day}`)
                                            }
                                            variant={
                                                failed
                                                    ? "destructive"
                                                    : "secondary"
                                            }
                                            className={`w-full justify-between h-auto py-3 ${
                                                failed
                                                    ? "bg-red-50 hover:bg-red-100"
                                                    : "bg-green-50 hover:bg-green-100"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {failed ? (
                                                    <Cross1Icon className="w-5 h-5" />
                                                ) : (
                                                    <CheckIcon className="w-5 h-5" />
                                                )}
                                                <div className="text-left">
                                                    <div className="font-medium capitalize">
                                                        {workout.lift}
                                                    </div>
                                                    <div className="text-sm opacity-90">
                                                        {date.toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            {workout.duration > 0 && (
                                                <div className="text-sm">
                                                    {formatTime(
                                                        workout.duration,
                                                    )}
                                                </div>
                                            )}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <div className="fixed bottom-4 right-4 flex gap-2">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleImport}
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
                </Button>
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleExport}
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
                </Button>
            </div>

            <footer className="text-center py-4 text-secondary-foreground">
                <p className="text-sm">Built for lifters, by lifters</p>
            </footer>
        </div>
    );
}
