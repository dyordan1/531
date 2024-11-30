import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { WeightUnitToggle } from "@/components/WeightUnitToggle";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "5/3/1 Exercise Tracker",
    description: "A shitty web app by https://dobri.xyz",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased pb-8 sm:pb-0`}
            >
                <Providers>
                    {children}
                    <WeightUnitToggle />
                </Providers>
            </body>
        </html>
    );
}
