import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeightDisplay } from "@/components/WeightDisplay";
import { cn } from "@/lib/utils";
import { PersonIcon } from "@radix-ui/react-icons";

interface LiftCardProps {
    lift: string;
    weight: number;
    bodyweight?: number;
    isActive?: boolean;
}

export function LiftCard({
    lift,
    weight,
    isActive = false,
    bodyweight,
}: LiftCardProps) {
    let title = lift;

    if (lift === "total") {
        title = "Est. Powerlifting Total";
    }
    if (lift === "press") {
        title = "Overhead Press";
    }

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
                        isActive
                            ? "dark:opacity-45 opacity-25"
                            : "dark:opacity-20 opacity-10",
                    )}
                >
                    <source src={`/${lift}.mp4`} type="video/mp4" />
                </video>
            </div>
            {isActive && (
                <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground z-10"
                >
                    Up Next
                </Badge>
            )}
            <CardHeader className="relative z-10">
                <CardTitle className="capitalize">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <WeightDisplay
                    weight={weight}
                    className="text-3xl font-bold text-primary"
                />
            </CardContent>
            {bodyweight !== undefined && bodyweight > 0 && (
                <Badge
                    variant="default"
                    className="absolute bottom-2 right-2 bg-primary text-primary-foreground z-10 text-xl flex items-center gap-1"
                >
                    <PersonIcon className="w-4 h-4" />
                    <WeightDisplay weight={bodyweight} />
                </Badge>
            )}
        </Card>
    );
}
