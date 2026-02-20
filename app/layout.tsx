import "@/app/globals.css";

import { Leaf, Search } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { AnnouncementBar } from "@/app/announcement-bar";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Your Next Store — Premium Natural Products",
	description:
		"Discover our curated collection of premium natural and wellness products. Quality you can trust.",
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
				{/* Announcement Bar */}
				<AnnouncementBar />

				{/* Main Header */}
				<header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
					{/* Upper header: logo + search + cart */}
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 sm:h-20">
							{/* Logo */}
							<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2 group">
								<Leaf className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:rotate-12" />
								<span className="text-lg sm:text-2xl font-bold tracking-tight text-foreground uppercase">
									Your Next Store
								</span>
							</YnsLink>

							{/* Search bar (hidden on mobile) */}
							<div className="hidden md:flex flex-1 max-w-md mx-8">
								<div className="relative w-full">
									<input
										type="text"
										placeholder="Search products..."
										className="w-full h-10 pl-4 pr-10 rounded-lg border border-border bg-secondary/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
									/>
									<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								</div>
							</div>

							{/* Cart */}
							<div className="flex items-center gap-3">
								<CartButton />
							</div>
						</div>
					</div>

					{/* Navigation */}
					<div className="border-t border-border bg-white">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<Navbar />
						</div>
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
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans antialiased`}>
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
