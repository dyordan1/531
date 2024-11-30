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
            {isActive && (
                <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground"
                >
                    Up Next
                </Badge>
            )}
            <CardHeader>
                <CardTitle className="capitalize">{lift}</CardTitle>
            </CardHeader>
            <CardContent>
                <WeightDisplay
                    weight={weight}
                    className="text-3xl font-bold text-primary"
                />
            </CardContent>
        </Card>
    );
}
