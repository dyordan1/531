"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { WorkoutSets } from "@/components/WorkoutSets";
import { useState, useEffect, useCallback, useMemo } from "react";
import { togglePreferredAssistance, recordWorkout } from "@/store/workoutSlice";
import { getWorkoutSets } from "@/lib/workout";
import { WorkoutDisplay } from "@/components/WorkoutDisplay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { CheckIcon } from "@radix-ui/react-icons";

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
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (startTime !== null) {
            intervalId = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [startTime]);

    const handleTimerToggle = () => {
        if (startTime === null) {
            setStartTime(Date.now());
            setElapsedTime(0);
        } else {
            setStartTime(null);
        }
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
            setStartTime(null);
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
                <PageContainer>
                    <PageHeader
                        title={`${currentLift} Day - ${weekDisplay}`}
                        showBackButton
                    />

                    <WorkoutTimer
                        isRunning={startTime !== null}
                        elapsedTime={elapsedTime}
                        onToggle={handleTimerToggle}
                    />

                    <Section
                        title={"Assistance Work"}
                        contentClassName="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        className="relative"
                    >
                        <Button
                            className="absolute right-2 top-2"
                            variant="link"
                            onClick={() =>
                                setShowAllAssistance(!showAllAssistance)
                            }
                        >
                            {showAllAssistance
                                ? "Show Preferred"
                                : "See All Options"}
                        </Button>
                        {displayedAssistance.map((exercise) => (
                            <div
                                key={exercise}
                                className="flex items-center gap-2"
                            >
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleAssistanceCompletion(exercise);
                                    }}
                                    variant={
                                        completedAssistance.includes(exercise)
                                            ? "default"
                                            : "secondary"
                                    }
                                    size="icon"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "grow justify-between",
                                        preferredAssistance.includes(
                                            exercise,
                                        ) && "border-primary",
                                        completedAssistance.includes(
                                            exercise,
                                        ) && "border-green-500",
                                    )}
                                    onClick={() =>
                                        handleAssistanceToggle(exercise)
                                    }
                                >
                                    <span>{exercise}</span>
                                    {preferredAssistance.includes(exercise) && (
                                        <Badge variant="secondary">
                                            Preferred
                                        </Badge>
                                    )}
                                </Button>
                            </div>
                        ))}
                        <p className="text-sm text-muted-foreground sm:col-span-2 mt-4">
                            {showAllAssistance
                                ? "Click to select up to 3 preferred exercises"
                                : "Perform 50-75 total reps of your preferred exercises"}
                        </p>
                    </Section>

                    <WorkoutSets
                        sets={workoutSets}
                        completedSets={completedSets}
                        failedSets={failedSets}
                        onToggleComplete={toggleSetCompletion}
                        onToggleFail={toggleSetFailure}
                        isDeloadWeek={currentWeek === 4}
                    />
                </PageContainer>
            )}
        </>
    );
}
