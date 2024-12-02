import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    description?: string;
    showBackButton?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export function PageHeader({
    description,
    showBackButton = false,
    className,
    children,
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
            <h1 className="flex flex-row items-center gap-2 text-3xl font-bold text-primary capitalize">
                {children}
            </h1>
            {description && (
                <p className="text-secondary-foreground">{description}</p>
            )}
        </header>
    );
}
