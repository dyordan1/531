import { useAppSelector } from "@/hooks/redux";
import { lbsToKg } from "@/lib/weight";

interface WeightDisplayProps {
    weight: number;
    className?: string;
    hideUnit?: boolean;
}

export function WeightDisplay({
    weight,
    className = "",
    hideUnit = false,
}: WeightDisplayProps) {
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const displayWeight = weightUnit === "kg" ? lbsToKg(weight) : weight;

    return (
        <span className={className}>
            {Math.round(displayWeight)}
            {!hideUnit && ` ${weightUnit}`}
        </span>
    );
}
