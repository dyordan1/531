"use client";

import { useAppSelector } from "@/hooks/redux";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { liftOrder } from "@/types/workout";
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { lbsToKg } from "@/lib/weight";
import { getLocalDateKey } from "@/lib/dates";

interface ChartData {
    date: string;
    [key: string]: string | number | boolean | undefined;
}

export default function ProgressPage() {
    const history = useAppSelector((state) => state.workout.history);
    const weightUnit = useAppSelector((state) => state.workout.weightUnit);

    const chartConfig = {
        squat: {
            theme: { light: "#ef4444", dark: "#dc2626" },
            label: "Squat",
        },
        bench: {
            theme: { light: "#3b82f6", dark: "#2563eb" },
            label: "Bench Press",
        },
        deadlift: {
            theme: { light: "#10b981", dark: "#059669" },
            label: "Deadlift",
        },
        press: {
            theme: { light: "#f59e0b", dark: "#d97706" },
            label: "Overhead Press",
        },
        weight: {
            theme: { light: "#a855f7", dark: "#9333ea" },
            label: "Bodyweight",
        },
    };

    const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
    const [showFailures, setShowFailures] = useState(false);
    const [showBodyweightRatio, setShowBodyweightRatio] = useState(false);

    const chartData: ChartData[] = Object.entries(history)
        .reduce((acc: ChartData[], [_, entry]) => {
            const weekStart = new Date(entry.date);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
            const weekKey = weekStart.toLocaleDateString();

            const convertWeight = (weight: number) =>
                weightUnit === "kg" ? lbsToKg(weight) : weight;

            const lastWeight =
                history[
                    Object.keys(history)
                        .filter(
                            (key) =>
                                history[key].weight &&
                                key < getLocalDateKey(weekStart),
                        )
                        .sort(
                            (a, b) =>
                                new Date(history[b].date).getTime() -
                                new Date(history[a].date).getTime(),
                        )[0]
                ]?.weight;

            const currentWeight = entry.weight ?? lastWeight;
            const convertedWeight = currentWeight
                ? convertWeight(currentWeight)
                : undefined;
            const convertedTrainingMax = convertWeight(entry.trainingMax);

            if (showBodyweightRatio && !convertedWeight) {
                return acc;
            }

            const existingEntry = acc.find((item) => item.date === weekKey);
            if (existingEntry) {
                if (showBodyweightRatio && convertedWeight) {
                    existingEntry[entry.lift] = +(
                        convertedTrainingMax / convertedWeight
                    ).toFixed(2);
                    existingEntry.weight = 1;
                } else {
                    existingEntry[entry.lift] = convertedTrainingMax;
                    if (convertedWeight) {
                        existingEntry.weight = convertedWeight;
                    }
                }
                existingEntry[`${entry.lift}Failed`] =
                    entry.mainSets.failed.length > 0;
            } else {
                acc.push({
                    date: weekKey,
                    [entry.lift]:
                        showBodyweightRatio && convertedWeight
                            ? +(convertedTrainingMax / convertedWeight).toFixed(
                                  2,
                              )
                            : convertedTrainingMax,
                    [`${entry.lift}Failed`]: entry.mainSets.failed.length > 0,
                    weight: showBodyweightRatio ? 1 : convertedWeight,
                });
            }
            return acc;
        }, [])
        .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

    const toggleLine = (dataKey: string) => {
        setHiddenLines((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(dataKey)) {
                newSet.delete(dataKey);
            } else {
                newSet.add(dataKey);
            }
            return newSet;
        });
    };

    const hasBodyweightRecords = Object.values(history).some(
        (entry) => entry.weight !== undefined,
    );

    return (
        <PageContainer>
            <PageHeader
                showBackButton
                description="Track your strength progress over time"
            >
                Progress Charts
            </PageHeader>

            <div className="grid gap-6">
                <Section title="All Lifts">
                    <ChartContainer className="h-[400px]" config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis
                                    fontSize={12}
                                    label={{
                                        value: showBodyweightRatio
                                            ? "× Bodyweight"
                                            : weightUnit.toUpperCase(),
                                        angle: -90,
                                        position: "insideLeft",
                                        style: { fontSize: 12 },
                                    }}
                                />
                                <ChartTooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length)
                                            return null;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid gap-2">
                                                    <span className="font-medium">
                                                        Date:{" "}
                                                        {
                                                            payload[0].payload
                                                                .date
                                                        }
                                                    </span>
                                                    {payload.map((entry) => {
                                                        if (
                                                            entry.value ===
                                                            undefined
                                                        )
                                                            return null;

                                                        const dataKey =
                                                            entry.dataKey as keyof typeof chartConfig;
                                                        const config =
                                                            chartConfig[
                                                                dataKey
                                                            ];
                                                        if (!config)
                                                            return null;

                                                        return (
                                                            <div
                                                                key={
                                                                    entry.dataKey
                                                                }
                                                                className="grid grid-cols-2 gap-2"
                                                            >
                                                                <span
                                                                    className="font-medium"
                                                                    style={{
                                                                        color: `var(--color-${entry.dataKey})`,
                                                                    }}
                                                                >
                                                                    {
                                                                        config.label
                                                                    }
                                                                    :
                                                                </span>
                                                                <span>
                                                                    {showBodyweightRatio
                                                                        ? Math.round(
                                                                              (entry.value as number) *
                                                                                  100,
                                                                          ) /
                                                                          100
                                                                        : Math.round(
                                                                              entry.value as number,
                                                                          )}{" "}
                                                                    {showBodyweightRatio
                                                                        ? "× BW"
                                                                        : weightUnit}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <Legend
                                    onClick={(e) =>
                                        toggleLine(e.dataKey as string)
                                    }
                                    wrapperStyle={{ cursor: "pointer" }}
                                />
                                {liftOrder.map((lift) => (
                                    <Line
                                        key={lift}
                                        type="monotone"
                                        dataKey={lift}
                                        name={chartConfig[lift].label}
                                        stroke={`var(--color-${lift})`}
                                        strokeWidth={2}
                                        dot={(props) => {
                                            const failed =
                                                props.payload[`${lift}Failed`];
                                            if (!showFailures || !failed)
                                                return <g key={props.key}></g>;
                                            const size = 4;
                                            return (
                                                <g key={props.key}>
                                                    <line
                                                        x1={props.cx - size}
                                                        y1={props.cy - size}
                                                        x2={props.cx + size}
                                                        y2={props.cy + size}
                                                        stroke={`var(--color-${lift})`}
                                                        strokeWidth={2}
                                                    />
                                                    <line
                                                        x1={props.cx - size}
                                                        y1={props.cy + size}
                                                        x2={props.cx + size}
                                                        y2={props.cy - size}
                                                        stroke={`var(--color-${lift})`}
                                                        strokeWidth={2}
                                                    />
                                                </g>
                                            );
                                        }}
                                        activeDot={{ r: 8 }}
                                        connectNulls
                                        hide={hiddenLines.has(lift)}
                                    />
                                ))}
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    name={chartConfig.weight.label}
                                    stroke={`var(--color-weight)`}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={false}
                                    connectNulls
                                    hide={hiddenLines.has("weight")}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="showFailures"
                                checked={showFailures}
                                onCheckedChange={(checked) =>
                                    setShowFailures(!!checked)
                                }
                            />
                            <label
                                htmlFor="showFailures"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Show failed sets
                            </label>
                        </div>
                        {hasBodyweightRecords && (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="show-bodyweight-ratio"
                                    checked={showBodyweightRatio}
                                    onCheckedChange={(checked) =>
                                        setShowBodyweightRatio(!!checked)
                                    }
                                />
                                <label
                                    htmlFor="show-bodyweight-ratio"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show as bodyweight ratio
                                </label>
                            </div>
                        )}
                    </div>
                </Section>
            </div>
        </PageContainer>
    );
}
