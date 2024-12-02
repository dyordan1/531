import { Input } from "@/components/ui/input";
import { kgToLbs, lbsToKg } from "@/lib/weight";
import { useAppSelector } from "@/hooks/redux";

interface WeightInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number;
    onValueChange: (value: number) => void;
    id?: string;
    placeholder?: string;
    className?: string;
}

export function WeightInput({
    value,
    onValueChange,
    id,
    placeholder = "Enter weight",
    className,
    ...rest
}: WeightInputProps) {
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const displayValue =
        value === 0
            ? ""
            : weightUnit === "kg"
              ? Math.round(lbsToKg(value))
              : Math.round(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value === "" ? 0 : Number(e.target.value);
        const valueInLbs =
            weightUnit === "kg" ? kgToLbs(inputValue) : inputValue;
        onValueChange(valueInLbs);
    };

    return (
        <Input
            id={id}
            type="number"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            min="0"
            className={className}
            {...rest}
        />
    );
}
