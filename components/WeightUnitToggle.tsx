"use client";

import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setWeightUnit } from "@/store/workoutSlice";

export function WeightUnitToggle() {
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    return (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-2">
            <div className="flex space-x-1">
                <button
                    onClick={() => dispatch(setWeightUnit("lbs"))}
                    className={`px-3 py-1 rounded ${
                        weightUnit === "lbs"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    lbs
                </button>
                <button
                    onClick={() => dispatch(setWeightUnit("kg"))}
                    className={`px-3 py-1 rounded ${
                        weightUnit === "kg"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    kg
                </button>
            </div>
        </div>
    );
}
