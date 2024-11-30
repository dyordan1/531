"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux";
import { WorkoutTimer } from "@/components/WorkoutTimer";
import { WorkoutSets } from "@/components/WorkoutSets";
import { getWorkoutSets } from "@/lib/workout";

export function WorkoutDisplay({ date }: { date: string }) {
    const router = useRouter();
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
                    <p className="text-gray-600">
                        Completed on {new Date(workout.date).toLocaleString()}
                    </p>
                </header>

                {duration !== 0 && (
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <WorkoutTimer
                            isRunning={false}
                            elapsedTime={duration}
                            readOnly={true}
                        />
                    </section>
                )}

                <WorkoutSets
                    sets={workoutSets}
                    completedSets={mainSets.completed}
                    failedSets={mainSets.failed}
                    readOnly={true}
                    isDeloadWeek={currentWeek === 4}
                />

                <section className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Completed Assistance Work
                    </h2>
                    <ul className="space-y-2">
                        {selectedAssistance.map((exercise, index) => (
                            <li
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                            >
                                <span
                                    className={`${
                                        completedAssistance.includes(exercise)
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {exercise}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}