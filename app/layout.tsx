import "@/app/globals.css";

import { Bell, Search } from "lucide-react";
import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";

const bodoniModa = Bodoni_Moda({
	variable: "--font-display",
	subsets: ["latin"],
	style: ["normal", "italic"],
	weight: ["400", "500", "600", "700"],
});

const inter = Inter({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
	title: "Skinclean - Clean, Organic & High-Tech Skincare",
	description:
		"Clean, organic, and high-tech skincare designed to reveal your most radiant self. Elevate your daily ritual.",
};

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col overflow-x-hidden">
				<header className="w-full px-6 py-8 md:px-12 relative z-50">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<YnsLink prefetch={"eager"} href="/" className="text-3xl font-display font-bold tracking-tight">
							Skinclean.
						</YnsLink>

						{/* Center Navigation */}
						<Navbar />

						{/* Right side controls */}
						<div className="flex items-center space-x-4 md:space-x-6">
							<div className="border border-foreground rounded-full px-5 py-1.5 text-xs font-semibold hidden sm:block">
								2025
							</div>
							<YnsLink href="/search" className="hover:text-primary transition-colors" aria-label="Search">
								<Search className="w-5 h-5" />
							</YnsLink>
							<button
								type="button"
								className="hover:text-primary transition-colors"
								aria-label="Notifications"
							>
								<Bell className="w-5 h-5" />
							</button>
							<CartButton />
						</div>
					</div>
				</header>
				<main className="flex-1 w-full">{children}</main>
				<Footer />
			</div>
			<CartSidebar />
		</CartProvider>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${bodoniModa.variable} ${inter.variable} antialiased`}>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
			</body>
		</html>
	);
}
