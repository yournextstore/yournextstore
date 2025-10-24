import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "./cart-button";
import "./globals.css";
import { ShoppingCartIcon } from "lucide-react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Your next e-commerce store",
};

function CartButtonFallback() {
	return (
		<div className="p-2 rounded-full w-10 h-10" aria-description="Loading cart">
			<ShoppingCartIcon className="w-6 h-6 opacity-20" />
		</div>
	);
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<header className="border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<Link href="/" className="text-xl font-bold">
								Your Next Store
							</Link>
							<Suspense fallback={<CartButtonFallback />}>
								<CartButton />
							</Suspense>
						</div>
					</div>
				</header>
				<Suspense>{children}</Suspense>
			</body>
		</html>
	);
}
