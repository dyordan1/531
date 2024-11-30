import { PlayIcon, StopIcon } from "@radix-ui/react-icons";

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
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                {readOnly ? "Workout Duration" : "(Optional) Start Timer"}
            </h2>
            <div className="flex items-center gap-4">
                <span className="text-2xl font-mono">
                    {formatTime(elapsedTime)}
                </span>
                {!readOnly && onToggle && (
                    <button
                        onClick={onToggle}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                            isRunning
                                ? "bg-red-200 text-red-800 hover:bg-red-300"
                                : "bg-green-200 text-green-800 hover:bg-green-300"
                        }`}
                    >
                        {isRunning ? (
                            <StopIcon className="w-5 h-5" />
                        ) : (
                            <PlayIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
