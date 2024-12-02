import { useAppSelector } from "@/hooks/redux";
import { lbsToKg } from "@/lib/weight";

interface WeightDisplayProps {
    weight: number;
    className?: string;
}

export function WeightDisplay({ weight, className = "" }: WeightDisplayProps) {
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const displayWeight = weightUnit === "kg" ? lbsToKg(weight) : weight;

    return (
        <span className={className}>
            {displayWeight > 0.999 ? Math.round(displayWeight) : "--"}{" "}
            {weightUnit}
        </span>
    );
}
