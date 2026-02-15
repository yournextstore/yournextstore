import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store | Specialty Tea Shop",
	description:
		"Discover our unique selection of specialty teas. Premium loose leaf teas from China, Japan, and beyond — crafted with tradition, no artificial flavors.",
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
				<div className="bg-primary text-primary-foreground text-center text-xs tracking-[0.2em] uppercase py-2.5 px-4">
					Free shipping on orders over $150
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-18">
							<div className="flex items-center gap-10">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-[family-name:var(--font-heading)] text-2xl tracking-wide text-foreground hover:text-foreground/80 transition-colors"
								>
									Your Next Store
								</YnsLink>
								<Navbar />
							</div>
							<CartButton />
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
			<body
				className={`${inter.variable} ${playfair.variable} font-[family-name:var(--font-sans)] antialiased`}
			>
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
