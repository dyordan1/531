"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMaxes } from "@/store/workoutSlice";
import { liftOrder } from "@/types/workout";
import { LiftCard } from "@/components/LiftCard";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { WeightInput } from "@/components/ui/WeightInput";
import { useAppSelector } from "@/hooks/redux";
import { Label } from "@/components/ui/label";

export default function NewUserOnboarding() {
    const [step, setStep] = useState<"intro" | "maxes" | "confirm">("intro");
    const maxes = useAppSelector((state) => state.workout.maxes);
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const router = useRouter();
    const dispatch = useDispatch();

    const handleComplete = () => {
        router.push("/");
    };

    return (
        <PageContainer>
            {step === "intro" && (
                <div className="space-y-6">
                    <PageHeader
                        description="5/3/1 is a powerlifting program based on making consistent, steady progress."
                        showBackButton
                    >
                        Welcome to 5/3/1
                    </PageHeader>

                    <Section className="pt-4">
                        <h3 className="text-lg font-semibold">
                            Program Overview
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                You&apos;ll train 4 days per week*, focusing on
                                one main lift each day
                            </li>
                            <li>
                                Each cycle lasts 3 weeks, followed by a deload
                                week
                            </li>
                            <li>
                                You&apos;ll gradually increase your weights
                                based on your Training Max
                            </li>
                            <li>Your Training Max is 90% of your actual max</li>
                        </ul>
                    </Section>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setStep("maxes")}
                    >
                        Let&apos;s Get Started
                    </Button>
                    <p className="text-sm text-secondary-foreground mt-2">
                        * The app will help you track your training days.
                        Remember to avoid training more than 2 consecutive days,
                        and don&apos;t worry if it takes longer than 7 days to
                        complete all 4 workouts—&quot;week&quot; is just a
                        convenient way to group the sessions.
                    </p>
                </div>
            )}

            {step === "maxes" && (
                <div className="space-y-6">
                    <PageHeader
                        description="Enter your one-rep max for each lift. If you don't know your exact max, enter a weight you're confident you could lift once with good form."
                        showBackButton
                    >
                        Enter Your Current Maxes
                    </PageHeader>

                    <Section className="grid gap-6 pt-4">
                        {liftOrder.map((lift) => (
                            <div key={lift}>
                                <Label htmlFor={lift} className="capitalize">
                                    {lift} ({weightUnit})
                                </Label>
                                <WeightInput
                                    id={lift}
                                    value={maxes[lift]}
                                    onChange={(value) => {
                                        dispatch(
                                            setMaxes({
                                                ...maxes,
                                                [lift]: value,
                                            }),
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </Section>

                    <Button
                        onClick={() => setStep("confirm")}
                        className="w-full"
                        size="lg"
                        disabled={Object.values(maxes).some((v) => !v)}
                    >
                        Calculate Training Maxes
                    </Button>
                </div>
            )}

            {step === "confirm" && (
                <div className="space-y-6">
                    <PageHeader
                        description="These are your training maxes (90% of your entered maxes). We'll use these numbers to calculate your working sets."
                        showBackButton
                    >
                        Your Training Maxes
                    </PageHeader>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {liftOrder.map((lift) => (
                            <LiftCard
                                key={lift}
                                lift={lift}
                                weight={maxes[lift] * 0.9}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleComplete}
                        className="w-full"
                        size="lg"
                    >
                        Start Your First Workout
                    </Button>
                </div>
            )}
        </PageContainer>
    );
}
