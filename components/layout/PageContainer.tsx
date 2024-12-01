import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function PageContainer({
    children,
    className,
    ...props
}: PageContainerProps) {
    return (
        <div className={cn("min-h-screen p-8 pb-0", className)} {...props}>
            <div className="max-w-2xl mx-auto space-y-8">{children}</div>
        </div>
    );
}
