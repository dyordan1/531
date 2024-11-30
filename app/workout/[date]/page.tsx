"use client";

import { WorkoutDisplay } from "@/components/WorkoutDisplay";

export default function HistoricalWorkoutPage({
    params,
}: {
    params: { date: string };
}) {
    console.log(params.date);
    return <WorkoutDisplay date={params.date} />;
}
