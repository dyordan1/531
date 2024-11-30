import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SectionProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export function Section({
    title,
    children,
    className,
    contentClassName,
}: SectionProps) {
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
