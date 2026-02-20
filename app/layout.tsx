import "@/app/globals.css";

import { Menu, Search } from "lucide-react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Suspense } from "react";
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

const dmSans = DM_Sans({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Function & Fashion — curated outerwear, bags and accessories",
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
				<div className="bg-foreground text-primary-foreground">
					<div className="flex items-center justify-center py-2.5 px-4">
						<p className="text-xs tracking-[0.2em] uppercase font-medium">Free delivery from 130 USD</p>
					</div>
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 lg:h-20">
							{/* Logo */}
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="text-lg sm:text-xl font-bold tracking-tight uppercase"
							>
								YNS
							</YnsLink>

							{/* Center Nav */}
							<Navbar />

							{/* Right Icons */}
							<div className="flex items-center gap-1">
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="p-2 hover:bg-secondary rounded-sm transition-colors"
									aria-label="Search"
								>
									<Search className="w-5 h-5" />
								</YnsLink>
								<CartButton />
								<button
									type="button"
									className="p-2 hover:bg-secondary rounded-sm transition-colors sm:hidden"
									aria-label="Menu"
								>
									<Menu className="w-5 h-5" />
								</button>
							</div>
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
			<body className={`${dmSans.variable} antialiased font-[family-name:var(--font-heading)]`}>
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
