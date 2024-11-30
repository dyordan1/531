import { WorkoutSet } from "@/types/workout";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { WeightDisplay } from "@/components/WeightDisplay";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <Card>
            <CardHeader>
                <CardTitle>Main Sets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {sets.map((set, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex flex-col gap-4 p-4 rounded-lg border",
                            completedSets.includes(index) && "border-green-500",
                            failedSets.includes(index) && "border-red-500",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="font-medium">
                                    Set {index + 1}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    ({Math.round(set.percentage * 100)}%)
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    <WeightDisplay weight={set.weight} />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {index === sets.length - 1 && !isDeloadWeek
                                        ? `AMRAP (${set.reps}+ reps)`
                                        : `${set.reps} reps`}
                                </div>
                            </div>
                        </div>
                        {!readOnly && (
                            <div className="flex gap-2 w-full">
                                <Button
                                    onClick={() => onToggleComplete?.(index)}
                                    variant={
                                        completedSets.includes(index)
                                            ? "default"
                                            : "secondary"
                                    }
                                    size="icon"
                                    className="flex-1"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => onToggleFail?.(index)}
                                    variant={
                                        failedSets.includes(index)
                                            ? "destructive"
                                            : "secondary"
                                    }
                                    size="icon"
                                    className="flex-1"
                                >
                                    <Cross1Icon className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
