import { PlayIcon, PauseIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeightInput } from "@/components/ui/WeightInput";
import { useAppSelector } from "@/hooks/redux";
import { WeightDisplay } from "./WeightDisplay";
import { Label } from "@/components/ui/label";

interface WorkoutTimerProps {
    isRunning: boolean;
    elapsedTime: number;
    onToggle?: () => void;
    readOnly?: boolean;
    weight: number;
    weightHint?: number;
    onWeightChange?: (weight: number) => void;
}

export const formatTime = (seconds: number) => {
    if (seconds === 0) return "--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function WorkoutTimer({
    isRunning,
    elapsedTime,
    onToggle,
    readOnly = false,
    weight,
    onWeightChange,
}: WorkoutTimerProps) {
    const latestWeight = useAppSelector((state) => state.workout.latestWeight);

    return (
        <Card>
            <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold">
                    {readOnly ? "Timer & Weight" : "Timer & Weight (Optional)"}
                </h2>
            </CardHeader>
            <CardContent className="flex flex-col min-[480px]:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                    {!readOnly && onToggle && (
                        <Button
                            onClick={onToggle}
                            variant={isRunning ? "secondary" : "default"}
                            size="icon"
                        >
                            {isRunning ? (
                                <PauseIcon className="w-5 h-5" />
                            ) : (
                                <PlayIcon className="w-5 h-5" />
                            )}
                        </Button>
                    )}
                    <span className="text-2xl font-mono">
                        {formatTime(elapsedTime)}
                    </span>
                </div>
                {!readOnly && onWeightChange && (
                    <div className="flex items-center justify-between gap-4">
                        <Label>Weigh-in:</Label>
                        <WeightInput
                            value={weight ?? 0}
                            onValueChange={(value) => onWeightChange(value)}
                            onFocus={() => onWeightChange(latestWeight)}
                            placeholder={
                                latestWeight > 0 ? latestWeight.toString() : ""
                            }
                            className="w-24"
                        />
                    </div>
                )}
                {readOnly && (
                    <div className="text-3xl font-bold text-muted-foreground">
                        <WeightDisplay weight={weight} />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
