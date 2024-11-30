import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeightDisplay } from "@/components/WeightDisplay";
import { cn } from "@/lib/utils";

interface LiftCardProps {
    lift: string;
    weight: number;
    isActive?: boolean;
}

export function LiftCard({ lift, weight, isActive = false }: LiftCardProps) {
    return (
        <Card className={cn("relative", isActive && "border-primary")}>
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn(
                        "w-full h-full object-cover",
                        isActive ? "opacity-25" : "opacity-10",
                    )}
                >
                    <source src={`/${lift}.mp4`} type="video/mp4" />
                </video>
            </div>
            {isActive && (
                <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground z-10"
                >
                    Up Next
                </Badge>
            )}
            <CardHeader className="relative z-10">
                <CardTitle className="capitalize">
                    {lift === "press" ? "Overhead Press" : lift}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <WeightDisplay
                    weight={weight}
                    className="text-3xl font-bold text-primary"
                />
            </CardContent>
        </Card>
    );
}
