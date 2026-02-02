import "@/app/globals.css";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchBar } from "@/app/search-bar";
import { ThemeToggle } from "@/app/theme-toggle";
import { WishlistButton } from "@/app/wishlist-button";
import { NavigationReporter } from "@/components/navigation-reporter";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Aura Audio - Premium Sound Gear",
	description: "Elevate your sound with premium audio equipment",
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
			<div className="flex min-h-screen flex-col">
				{/* Aura Audio Header */}
				<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
					<div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
						<nav className="flex flex-col md:flex-row items-center justify-between gap-4">
							{/* Logo */}
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center font-bold text-xl">
									A
								</div>
								<YnsLink prefetch={"eager"} href="/" className="text-xl font-bold tracking-tight">
									aura.
								</YnsLink>
							</div>

							{/* Search Bar */}
							<SearchBar />

							{/* Action Buttons */}
							<div className="flex items-center gap-3">
								<Navbar />
								<CartButton />
								<WishlistButton />
								<ThemeToggle />
							</div>
						</nav>
					</div>
				</header>
				<div className="flex-1">{children}</div>
				<Footer />
				<ReferralBadge />
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
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${plusJakartaSans.variable} font-sans antialiased`}>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				<NavigationReporter />
			</body>
		</html>
	);
}
