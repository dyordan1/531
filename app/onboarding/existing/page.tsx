"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentWeek, setMaxes, setCurrentLift } from "@/store/workoutSlice";
import { type Maxes, type Lift, liftOrder } from "@/types/workout";
import { useAppSelector } from "@/hooks/redux";
import { WeightDisplay } from "@/components/WeightDisplay";
import { Button } from "@/components/ui/button";
import { LiftCard } from "@/components/LiftCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Label } from "@/components/ui/label";
import { WeightInput } from "@/components/ui/WeightInput";

export default function ExistingUserOnboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [maxType, setMaxType] = useState<"training" | "actual">("training");
    const maxes = useAppSelector((state) => state.workout.maxes);
    const currentWeek = useAppSelector((state) => state.workout.currentWeek);
    const currentLift = useAppSelector((state) => state.workout.currentLift);
    const weightsInitialized = Object.values(maxes).every(
        (weight) => weight > 0,
    );

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
        <PageContainer>
            <PageHeader
                description={
                    weightsInitialized
                        ? "You can edit your program manually here. The app will calculate your training maxes automatically based on history."
                        : "Welcome to 5/3/1. Let's get your numbers set up."
                }
                showBackButton
            >
                Edit Your Program
            </PageHeader>

            <Section className="pt-4">
                <div className="flex gap-4 sm:flex-row flex-col">
                    <Button
                        onClick={() => setMaxType("actual")}
                        variant={maxType === "actual" ? "default" : "outline"}
                        className="flex-1"
                    >
                        Actual 1RM
                    </Button>
                    <Button
                        onClick={() => setMaxType("training")}
                        variant={maxType === "training" ? "default" : "outline"}
                        className="flex-1"
                    >
                        Training Max
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                    {maxType === "actual"
                        ? "Enter your actual one-rep maxes. We'll calculate your training maxes (90%) automatically."
                        : "Enter your training maxes directly if you already know them."}
                </p>
            </Section>

            <div className="grid sm:grid-cols-2 gap-4">
                {liftOrder.map((lift) => (
                    <Section key={lift} className="pt-4">
                        <Label className="text-primary capitalize">
                            {lift} {maxType === "actual" ? "1RM" : "TM"}
                        </Label>
                        <WeightInput
                            value={
                                maxType === "actual"
                                    ? maxes[lift] / 0.9
                                    : maxes[lift]
                            }
                            onChange={(value) => {
                                const finalValue =
                                    maxType === "actual" ? value * 0.9 : value;
                                dispatch(
                                    setMaxes({ ...maxes, [lift]: finalValue }),
                                );
                            }}
                            className="pr-12"
                        />
                        {maxType === "actual" && maxes[lift] > 0 && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Training Max:{" "}
                                <WeightDisplay weight={maxes[lift]} />
                            </p>
                        )}
                    </Section>
                ))}
            </div>

            <Section className="pt-4">
                <Label className="text-muted-foreground">Current Week</Label>
                <div className="grid grid-cols-2 sm:flex gap-2 mt-2">
                    {[1, 2, 3, 4].map((week) => (
                        <Button
                            key={week}
                            onClick={() => dispatch(setCurrentWeek(week))}
                            variant={
                                currentWeek === week ? "default" : "outline"
                            }
                            className="w-full"
                        >
                            {week === 4 ? "Deload" : `Week ${week}`}
                        </Button>
                    ))}
                </div>

                <Label className="text-muted-foreground mt-6 block">
                    Upcoming Lift
                </Label>
                <div className="grid grid-cols-2 sm:flex gap-2 mt-2">
                    {liftOrder.map((lift) => (
                        <Button
                            key={lift}
                            onClick={() =>
                                dispatch(setCurrentLift(lift as Lift))
                            }
                            variant={
                                currentLift === lift ? "default" : "outline"
                            }
                            className="w-full capitalize"
                        >
                            {lift}
                        </Button>
                    ))}
                </div>
            </Section>

            <Section title="Program Preview">
                <div className="grid sm:grid-cols-2 gap-4">
                    {liftOrder.map((lift) => (
                        <LiftCard
                            key={lift}
                            lift={lift}
                            weight={maxes[lift]}
                            isActive={lift === currentLift}
                        />
                    ))}
                </div>
            </Section>

            <Button
                className="w-full"
                size="lg"
                onClick={handleComplete}
                disabled={!isValid}
            >
                Start Training
            </Button>
        </PageContainer>
    );
}
