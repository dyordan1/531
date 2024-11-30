import { WorkoutSet } from "@/types/workout";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { WeightDisplay } from "@/components/WeightDisplay";

interface WorkoutSetsProps {
    sets: WorkoutSet[];
    completedSets: number[];
    failedSets: number[];
    onToggleComplete?: (index: number) => void;
    onToggleFail?: (index: number) => void;
    readOnly?: boolean;
    isDeloadWeek?: boolean;
}

export function WorkoutSets({
    sets,
    completedSets,
    failedSets,
    onToggleComplete,
    onToggleFail,
    readOnly = false,
    isDeloadWeek = false,
}: WorkoutSetsProps) {
    return (
        <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Main Sets</h2>
            <div className="space-y-4">
                {sets.map((set, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            {!readOnly && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            onToggleComplete?.(index)
                                        }
                                        className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                            completedSets.includes(index)
                                                ? "bg-green-200 text-green-800"
                                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                        }`}
                                    >
                                        <CheckIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onToggleFail?.(index)}
                                        className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                            failedSets.includes(index)
                                                ? "bg-red-200 text-red-800"
                                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                        }`}
                                    >
                                        <Cross1Icon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <span
                                className={`text-lg font-medium ${
                                    completedSets.includes(index)
                                        ? "text-green-600"
                                        : failedSets.includes(index)
                                          ? "text-red-600"
                                          : ""
                                }`}
                            >
                                Set {index + 1}
                            </span>
                            <span className="text-gray-600">
                                ({Math.round(set.percentage * 100)}%)
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                                <WeightDisplay weight={set.weight} />
                            </div>
                            <div className="text-gray-600">
                                {index === sets.length - 1 && !isDeloadWeek
                                    ? `AMRAP (${set.reps}+ reps)`
                                    : `${set.reps} reps`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
