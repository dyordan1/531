"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentWeek, setMaxes, setCurrentLift } from "@/store/workoutSlice";
import { type Maxes, type Lift, liftOrder } from "@/types/workout";
import { useAppSelector } from "@/hooks/redux";
import { WeightDisplay } from "@/components/WeightDisplay";
import { kgToLbs, lbsToKg } from "@/lib/weight";
import { Button } from "@/components/ui/button";
import { LiftCard } from "@/components/LiftCard";
import { Card, CardContent } from "@/components/ui/card";

export default function ExistingUserOnboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [maxType, setMaxType] = useState<"training" | "actual">("training");
    const maxes = useAppSelector((state) => state.workout.maxes);
    const currentWeek = useAppSelector((state) => state.workout.currentWeek);
    const currentLift = useAppSelector((state) => state.workout.currentLift);
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);
    const weightsInitialized = Object.values(maxes).every(
        (weight) => weight > 0,
    );

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
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary">
                        Edit Your Program
                    </h1>
                    {weightsInitialized && (
                        <p className="mt-2 text-secondary-foreground">
                            You can edit your program manually here. The app
                            will calculate your training maxes automatically
                            based on history. If you find yourself on this page
                            often, let me know!
                        </p>
                    )}
                    {!weightsInitialized && (
                        <p className="mt-2 text-secondary-foreground">
                            Welcome to 5/3/1. Let&apos;s get your numbers set
                            up.
                        </p>
                    )}
                </div>

                <Card className="pt-6">
                    <CardContent className="space-y-4 pt-0">
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setMaxType("actual")}
                                variant={
                                    maxType === "actual" ? "default" : "outline"
                                }
                                className="flex-1"
                            >
                                Actual 1RM
                            </Button>
                            <Button
                                onClick={() => setMaxType("training")}
                                variant={
                                    maxType === "training"
                                        ? "default"
                                        : "outline"
                                }
                                className="flex-1"
                            >
                                Training Max
                            </Button>
                        </div>

                        <p className="text-sm text-secondary-foreground">
                            {maxType === "actual"
                                ? "Enter your actual one-rep maxes. We'll calculate your training maxes (90%) automatically."
                                : "Enter your training maxes directly if you already know them."}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                    {liftOrder.map((lift) => (
                        <Card key={lift}>
                            <CardContent className="pt-6">
                                <label className="block">
                                    <span className="text-sm font-medium text-primary capitalize">
                                        {lift}{" "}
                                        {maxType === "actual" ? "1RM" : "TM"}
                                    </span>
                                    <div className="relative mt-1">
                                        <input
                                            type="number"
                                            value={(() => {
                                                const baseValue =
                                                    maxType === "actual"
                                                        ? maxes[lift] / 0.9
                                                        : maxes[lift];
                                                const raw =
                                                    weightUnit === "kg"
                                                        ? kgToLbs(
                                                              Number(baseValue),
                                                          )
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
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary-foreground">
                                            {weightUnit}
                                        </div>
                                    </div>
                                </label>
                                {maxType === "actual" && maxes[lift] > 0 && (
                                    <div className="mt-2 text-sm text-secondary-foreground">
                                        Training Max:{" "}
                                        <WeightDisplay weight={maxes[lift]} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="pt-6">
                    <CardContent className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-3">
                                Current Week
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((week) => (
                                    <Button
                                        key={week}
                                        onClick={() =>
                                            dispatch(setCurrentWeek(week))
                                        }
                                        variant={
                                            currentWeek === week
                                                ? "secondary"
                                                : "outline"
                                        }
                                        className="flex-1"
                                    >
                                        {week === 4 ? "Deload" : `Week ${week}`}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-3">
                                Upcoming Lift
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {liftOrder.map((lift) => (
                                    <Button
                                        key={lift}
                                        onClick={() =>
                                            dispatch(
                                                setCurrentLift(lift as Lift),
                                            )
                                        }
                                        variant={
                                            currentLift === lift
                                                ? "secondary"
                                                : "outline"
                                        }
                                        className="capitalize"
                                    >
                                        {lift}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h3 className="font-medium text-primary text-lg font-semibold">
                    Your Training Maxes
                </h3>
                <div className="mt-2 grid sm:grid-cols-2 gap-4">
                    {liftOrder.map((lift) => (
                        <LiftCard
                            key={lift}
                            lift={lift}
                            weight={maxes[lift]}
                            isActive={lift === currentLift}
                        />
                    ))}
                </div>

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleComplete}
                    disabled={!isValid}
                >
                    Start Training
                </Button>
            </div>
        </div>
    );
}
