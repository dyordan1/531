"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAllState } from "@/store/workoutSlice";
import {
    CheckIcon,
    Cross1Icon,
    PersonIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons";
import { formatTime } from "@/components/WorkoutTimer";
import { liftOrder } from "@/types/workout";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { LiftCard } from "@/components/LiftCard";
import { useMemo } from "react";
import { getLocalDateKey } from "@/lib/dates";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import Image from "next/image";
import { useTheme } from "next-themes";
import { WeightDisplay } from "@/components/WeightDisplay";
import { getWorkoutSets } from "@/lib/workout";

export default function Home() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { resolvedTheme } = useTheme();
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
        const dateKey = getLocalDateKey();
        return workoutHistory[dateKey];
    };

    const getWorkoutStatus = (date: Date) => {
        const dateKey = getLocalDateKey(date);
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
        <PageContainer>
            <PageHeader description="Simplifying your strength journey">
                <Image
                    src={
                        resolvedTheme === "dark"
                            ? "/logo-dark.png"
                            : "/logo-light.png"
                    }
                    height={32}
                    width={32}
                    alt="Logo"
                />
                5/3/1 App
            </PageHeader>

            <main className="space-y-8">
                {weightsInitialized ? (
                    <>
                        <Section
                            title={`Your Program - ${weekDisplay}`}
                            variant="plain"
                        >
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
                                                            It&apos;s been 7+
                                                            days straight!
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold">
                                                            Consider taking a
                                                            rest day
                                                        </p>
                                                        <p className="text-sm">
                                                            You&apos;ve trained{" "}
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

                            <LiftCard
                                key="total"
                                lift="total"
                                weight={
                                    (trainingMaxes.squat +
                                        trainingMaxes.bench +
                                        trainingMaxes.deadlift) /
                                    0.9
                                }
                                bodyweight={state.latestWeight}
                            />
                            <Button
                                className="w-full"
                                size="lg"
                                variant="secondary"
                                onClick={() => router.push("/progress")}
                            >
                                View Your Progress
                            </Button>
                        </Section>
                    </>
                ) : (
                    <Section variant="plain">
                        <Button
                            onClick={() => router.push("/onboarding/new")}
                            className="w-full h-auto py-6 flex flex-col items-center whitespace-normal"
                            size="lg"
                        >
                            <h2 className="text-xl sm:text-3xl font-semibold">
                                I&apos;m New to 5/3/1
                            </h2>
                            <p className="mt-2 text-sm sm:text-base opacity-90">
                                Get started with a guided setup and learn the
                                program basics
                            </p>
                        </Button>

                        <Button
                            onClick={() => router.push("/onboarding/existing")}
                            className="w-full h-auto py-6 flex flex-col items-center whitespace-normal"
                            size="lg"
                            variant="secondary"
                        >
                            <h2 className="text-xl sm:text-3xl font-semibold">
                                I Know My Numbers
                            </h2>
                            <p className="mt-2 text-sm sm:text-base opacity-90">
                                Jump right in with your existing training maxes
                            </p>
                        </Button>
                    </Section>
                )}

                {weightsInitialized && workoutDays.length > 0 && (
                    <Section title="Workout History" variant="plain">
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
                                        const status = getWorkoutStatus(date);
                                        return (
                                            <div
                                                className={`w-full h-full flex items-center justify-center ${
                                                    status === "failed"
                                                        ? "bg-red-100 text-red-900"
                                                        : status === "success"
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
                                    const dateKey = getLocalDateKey(date);
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
                                const date = new Date(workout.date);
                                const failed =
                                    workout.mainSets.failed.length > 0;
                                const sets = getWorkoutSets(workout.week);
                                const maxWeight =
                                    sets[sets.length - 1].percentage *
                                    workout.trainingMax;

                                return (
                                    <Button
                                        key={day}
                                        onClick={() =>
                                            router.push(`/workout/${day}`)
                                        }
                                        variant="secondary"
                                        className={`w-full justify-between h-auto py-3 ${
                                            failed
                                                ? "bg-red-50 dark:bg-red-500 hover:bg-red-100 dark:hover:bg-red-600"
                                                : "bg-green-50 dark:bg-green-500 hover:bg-green-100 dark:hover:bg-green-600"
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
                                                    {workout.lift} (
                                                    <WeightDisplay
                                                        weight={maxWeight}
                                                    />
                                                    )
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    {date.toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end text-sm">
                                            {workout.duration > 0 && (
                                                <div className="flex w-full justify-between items-center gap-1">
                                                    <StopwatchIcon className="w-4 h-4" />
                                                    {formatTime(
                                                        workout.duration,
                                                    )}
                                                </div>
                                            )}
                                            {workout.weight && (
                                                <span className="flex w-full justify-between items-center gap-1">
                                                    <PersonIcon className="w-4 h-4" />
                                                    <WeightDisplay
                                                        weight={workout.weight}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    </Section>
                )}
            </main>

            <div className="fixed bottom-4 right-4 flex gap-2 z-50">
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
        </PageContainer>
    );
}
