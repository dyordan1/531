"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentWeek, setMaxes, setCurrentLift } from "@/store/workoutSlice";
import type { Maxes, Lift } from "@/types/workout";
import { useAppSelector } from "@/hooks/redux";
import { WeightUnitToggle } from "@/components/WeightUnitToggle";
import { WeightDisplay } from "@/components/WeightDisplay";
import { kgToLbs, lbsToKg } from "@/lib/weight";

export default function ExistingUserOnboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [maxType, setMaxType] = useState<"training" | "actual">("training");
    const maxes = useAppSelector((state) => state.workout.maxes);
    const currentWeek = useAppSelector((state) => state.workout.currentWeek);
    const currentLift = useAppSelector((state) => state.workout.currentLift);
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);
    console.log(currentWeek);

    const handleMaxesChange =
        (lift: keyof Maxes) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = Number(e.target.value);
            const valueInLbs =
                weightUnit === "kg" ? lbsToKg(inputValue) : inputValue;
            const value = maxType === "actual" ? valueInLbs * 0.9 : valueInLbs;
            dispatch(setMaxes({ ...maxes, [lift]: value }));
        };

    const isValid = Object.values(maxes).every((v) => v > 0);

    const handleComplete = () => {
        const valuesToStore =
            maxType === "actual"
                ? Object.entries(maxes).reduce(
                      (acc, [lift, value]) => ({
                          ...acc,
                          [lift]: value * 0.9,
                      }),
                      {} as Maxes,
                  )
                : maxes;

        dispatch(setMaxes(valuesToStore));
        router.push("/workout");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Enter Your Maxes
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Welcome to 5/3/1. Let&apos;s get your numbers set up.
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setMaxType("actual")}
                                className={`flex-1 p-3 rounded-lg border ${
                                    maxType === "actual"
                                        ? "bg-blue-50 border-blue-600 text-blue-700"
                                        : "border-gray-300"
                                }`}
                            >
                                Actual 1RM
                            </button>
                            <button
                                onClick={() => setMaxType("training")}
                                className={`flex-1 p-3 rounded-lg border ${
                                    maxType === "training"
                                        ? "bg-blue-50 border-blue-600 text-blue-700"
                                        : "border-gray-300"
                                }`}
                            >
                                Training Max
                            </button>
                        </div>

                        <p className="text-sm text-gray-600">
                            {maxType === "actual"
                                ? "Enter your actual one-rep maxes. We'll calculate your training maxes (90%) automatically."
                                : "Enter your training maxes directly if you already know them."}
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(maxes).map(([lift, value]) => (
                        <div
                            key={lift}
                            className="bg-white p-4 rounded-lg shadow-sm"
                        >
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                    {lift} {maxType === "actual" ? "1RM" : "TM"}
                                </span>
                                <div className="relative mt-1">
                                    <input
                                        type="number"
                                        value={(() => {
                                            const baseValue =
                                                maxType === "actual"
                                                    ? value / 0.9 || ""
                                                    : value || "";
                                            const raw =
                                                weightUnit === "kg"
                                                    ? kgToLbs(Number(baseValue))
                                                    : baseValue;
                                            return Math.round(raw);
                                        })()}
                                        onChange={handleMaxesChange(
                                            lift as keyof Maxes,
                                        )}
                                        className="block w-full p-3 border border-gray-300 rounded-md pr-12"
                                        placeholder="Enter weight"
                                        min="0"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                                        {weightUnit}
                                    </div>
                                </div>
                            </label>
                            {maxType === "actual" && value > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Training Max:{" "}
                                    <WeightDisplay
                                        weight={maxes[lift as keyof Maxes]}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900">
                        Your Training Maxes
                    </h3>
                    <div className="mt-2 grid sm:grid-cols-2 gap-4">
                        {Object.entries(maxes).map(([lift, value]) => (
                            <div key={lift} className="flex justify-between">
                                <span className="capitalize text-blue-800">
                                    {lift}
                                </span>
                                <WeightDisplay
                                    weight={value}
                                    className="font-medium text-blue-900"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Current Week
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((week) => (
                                <button
                                    key={week}
                                    onClick={() =>
                                        dispatch(setCurrentWeek(week))
                                    }
                                    className={`flex-1 p-3 rounded-lg border ${
                                        currentWeek === week
                                            ? "bg-blue-50 border-blue-600 text-blue-700"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {week === 4 ? "Deload" : `Week ${week}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Upcoming Lift
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.keys(maxes).map((lift) => (
                                <button
                                    key={lift}
                                    onClick={() =>
                                        dispatch(setCurrentLift(lift as Lift))
                                    }
                                    className={`p-3 rounded-lg border capitalize ${
                                        currentLift === lift
                                            ? "bg-blue-50 border-blue-600 text-blue-700"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {lift}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleComplete}
                    disabled={!isValid}
                    className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Start Training
                </button>
            </div>

            <WeightUnitToggle />
        </div>
    );
}
