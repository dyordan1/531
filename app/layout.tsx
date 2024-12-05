import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { WeightUnitToggle } from "@/components/WeightUnitToggle";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

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
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased pb-12 md:pb-0`}
            >
                <Providers>
                    {children}
                    <WeightUnitToggle />
                    <Footer />
                </Providers>
                <GoogleAnalytics
                    gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!}
                />
            </body>
        </html>
    );
}
