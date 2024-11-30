import { PlayIcon, StopIcon } from "@radix-ui/react-icons";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkoutTimerProps {
    isRunning: boolean;
    elapsedTime: number;
    onToggle?: () => void;
    readOnly?: boolean;
}

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function WorkoutTimer({
    isRunning,
    elapsedTime,
    onToggle,
    readOnly = false,
}: WorkoutTimerProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold">
                    {readOnly ? "Workout Duration" : "(Optional) Start Timer"}
                </h2>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
                <span className="text-2xl font-mono">
                    {formatTime(elapsedTime)}
                </span>
                {!readOnly && onToggle && (
                    <Button
                        onClick={onToggle}
                        variant={isRunning ? "destructive" : "default"}
                        size="icon"
                    >
                        {isRunning ? (
                            <StopIcon className="w-5 h-5" />
                        ) : (
                            <PlayIcon className="w-5 h-5" />
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
