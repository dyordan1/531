"use client";

import { WorkoutDisplay } from "@/components/WorkoutDisplay";
import { use } from "react";

export default function HistoricalWorkoutPage({
    params,
}: {
    params: Promise<{ date: string }>;
}) {
    const date = use(params).date;
    return <WorkoutDisplay date={date} />;
}
