"use client";

import { useAppSelector } from "@/hooks/redux";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { WorkoutSets } from "@/components/WorkoutSets";
import { getWorkoutSets } from "@/lib/workout";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { cn } from "@/lib/utils";

export function WorkoutDisplay({ date }: { date: string }) {
    const workout = useAppSelector((state) => state.workout.history[date]);

    if (!workout) {
        return <div>Workout not found</div>;
    }

    const {
        lift: currentLift,
        week: currentWeek,
        trainingMax,
        duration,
        mainSets,
        selectedAssistance,
        completedAssistance,
    } = workout;

    const workoutSets = getWorkoutSets(currentWeek).map((set) => ({
        ...set,
        weight: Math.round(set.percentage * trainingMax),
    }));

    const weekDisplay =
        currentWeek === 4 ? "Deload Week" : `Week ${currentWeek}`;

    return (
        <PageContainer>
            <PageHeader
                description={`Completed on ${new Date(
                    workout.date,
                ).toLocaleString()}`}
                showBackButton
            >
                {currentLift} Day - {weekDisplay}
            </PageHeader>

            {duration !== 0 && (
                <WorkoutTimer
                    isRunning={false}
                    elapsedTime={duration}
                    readOnly={true}
                />
            )}

            <WorkoutSets
                sets={workoutSets}
                completedSets={mainSets.completed}
                failedSets={mainSets.failed}
                readOnly={true}
                isDeloadWeek={currentWeek === 4}
            />

            <Section title="Completed Assistance Work">
                <div className="space-y-2">
                    {selectedAssistance.map((exercise, index) => (
                        <div
                            key={index}
                            className={cn(
                                completedAssistance.includes(exercise) &&
                                    "border-green-500",
                                "flex items-center justify-between p-3 rounded-lg border",
                            )}
                        >
                            <span className="capitalize">{exercise}</span>
                        </div>
                    ))}
                </div>
            </Section>
        </PageContainer>
    );
}
