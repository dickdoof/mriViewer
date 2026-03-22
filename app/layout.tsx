import { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
});

export const viewport: Viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			data-theme={config.colors.theme}
			className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className}`}
		>
			<body className="bg-[var(--color-surface)] text-[var(--color-rm-on-surface)]">
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
