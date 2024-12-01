import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    variant?: "default" | "plain";
}

export function Section({
    title,
    children,
    className,
    contentClassName,
    variant = "default",
}: SectionProps) {
    if (variant === "plain") {
        return (
            <section className={className}>
                {title && (
                    <div className="pb-2">
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                )}
                <div className={cn("space-y-4", contentClassName)}>
                    {children}
                </div>
            </section>
        );
    }

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <CardContent className={cn("space-y-4", contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
}
