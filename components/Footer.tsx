import Link from "next/link";

export function Footer() {
    return (
        <footer className="max-w-lg mx-auto pb-8 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span>©️ (not really) {new Date().getFullYear()} - </span>
                    <Link
                        href="https://github.com/dyordan1/531"
                        className="hover:underline"
                        target="_blank"
                    >
                        View on GitHub
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="https://dobri.xyz"
                        className="hover:underline"
                        target="_blank"
                    >
                        dobri.xyz
                    </Link>
                    <Link href="https://buymeacoffee.com/dobri" target="_blank">
                        <img
                            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                            alt="Buy Me A Coffee"
                            className="h-[32px]"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
