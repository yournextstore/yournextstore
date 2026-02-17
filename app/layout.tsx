import "@/app/globals.css";

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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
	variable: "--font-dm-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Fashion-forward essentials for every season",
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
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<p className="text-center text-xs sm:text-sm py-2.5 tracking-wider uppercase">
							Final Clearance: Take 20% off &apos;Sale Must-Haves&apos;
						</p>
					</div>
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-14">
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="font-heading text-2xl font-semibold tracking-tight"
							>
								YNS
							</YnsLink>
							<Navbar />
							<div className="flex items-center gap-2">
								<CartButton />
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
			<body
				className={`${dmSans.variable} ${cormorant.variable} font-[family-name:var(--font-dm-sans)] antialiased`}
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
