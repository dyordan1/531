"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setWeightUnit } from "@/store/workoutSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WeightUnitToggle() {
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    return (
        <Card className="fixed bottom-4 left-4 z-50">
            <CardContent className="p-2">
                <div className="flex space-x-1">
                    <Button
                        onClick={() => dispatch(setWeightUnit("lbs"))}
                        variant={weightUnit === "lbs" ? "default" : "secondary"}
                        size="sm"
                    >
                        lbs
                    </Button>
                    <Button
                        onClick={() => dispatch(setWeightUnit("kg"))}
                        variant={weightUnit === "kg" ? "default" : "secondary"}
                        size="sm"
                    >
                        kg
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
