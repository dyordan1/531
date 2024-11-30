import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    title: string;
    description?: string;
    showBackButton?: boolean;
    className?: string;
}

export function PageHeader({
    title,
    description,
    showBackButton = false,
    className,
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <header className={cn("space-y-2", className)}>
            {showBackButton && (
                <Button
                    variant="link"
                    onClick={() => router.push("/")}
                    className="px-0"
                >
                    ← Back to Dashboard
                </Button>
            )}
            <h1 className="text-3xl font-bold text-primary capitalize">
                {title}
            </h1>
            {description && (
                <p className="text-secondary-foreground">{description}</p>
            )}
        </header>
    );
}
