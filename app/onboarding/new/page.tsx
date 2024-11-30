"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMaxes } from "@/store/workoutSlice";
import { useAppSelector } from "@/hooks/redux";
import { WeightDisplay } from "@/components/WeightDisplay";
import { kgToLbs, lbsToKg } from "@/lib/weight";

type OnboardingStep = "intro" | "maxes" | "confirm";

export default function NewUserOnboarding() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [step, setStep] = useState<OnboardingStep>("intro");
    const maxes = useAppSelector((state) => state.workout.maxes);
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const handleMaxesChange =
        (lift: keyof typeof maxes) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = Number(e.target.value);
            const valueInLbs =
                weightUnit === "kg" ? lbsToKg(inputValue) : inputValue;
            const trainingMax = valueInLbs * 0.9;
            dispatch(setMaxes({ ...maxes, [lift]: trainingMax }));
        };

    const handleComplete = () => {
        router.push("/workout");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                {step === "intro" && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome to 5/3/1
                        </h1>
                        <div className="prose prose-blue">
                            <p className="text-lg">
                                5/3/1 is a powerlifting program based on making
                                consistent, steady progress. Here&apos;s what
                                you need to know:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    You&apos;ll train 4 days per week*, focusing
                                    on one main lift each day
                                </li>
                                <li>
                                    Each cycle lasts 3 weeks, followed by a
                                    deload week
                                </li>
                                <li>
                                    You&apos;ll gradually increase your weights
                                    based on your Training Max
                                </li>
                                <li>
                                    Your Training Max is 90% of your actual max
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStep("maxes")}
                            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Let&apos;s Get Started
                        </button>
                        <p className="text-sm text-gray-600 mt-2">
                            * The app will help you track your training days.
                            Remember to avoid training more than 2 consecutive
                            days, and don&apos;t worry if it takes longer than 7
                            days to complete all 4 workouts—&quot;week&quot; is
                            just a convenient way to group the sessions.
                        </p>
                    </div>
                )}

                {step === "maxes" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Enter Your Current Maxes
                        </h2>
                        <p className="text-gray-600">
                            Enter your one-rep max for each lift. If you
                            don&apos;t know your exact max, enter a weight
                            you&apos;re confident you could lift once with good
                            form.
                        </p>

                        <div className="space-y-4">
                            {Object.entries(maxes).map(([lift, value]) => (
                                <div key={lift} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                        {lift} ({weightUnit})
                                    </label>
                                    <input
                                        type="number"
                                        value={(() => {
                                            if (!value) return "";
                                            const baseValue =
                                                Number(value) / 0.9;
                                            const raw =
                                                weightUnit === "kg"
                                                    ? kgToLbs(Number(baseValue))
                                                    : baseValue;
                                            return Math.round(raw);
                                        })()}
                                        onChange={handleMaxesChange(
                                            lift as keyof typeof maxes,
                                        )}
                                        className="mt-1 p-3 border border-gray-300 rounded-md"
                                        placeholder={`Enter weight in ${weightUnit}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep("confirm")}
                            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={Object.values(maxes).some((v) => !v)}
                        >
                            Calculate Training Maxes
                        </button>
                    </div>
                )}

                {step === "confirm" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Training Maxes
                        </h2>
                        <p className="text-gray-600">
                            These are your training maxes (90% of your entered
                            maxes). We&apos;ll use these numbers to calculate
                            your working sets.
                        </p>

                        <div className="space-y-4">
                            {Object.entries(maxes).map(([lift, value]) => (
                                <div
                                    key={lift}
                                    className="p-4 bg-white rounded-lg shadow"
                                >
                                    <div className="font-medium capitalize">
                                        {lift}
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        <WeightDisplay weight={value} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleComplete}
                            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Start Your First Workout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
