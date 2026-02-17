import "@/app/globals.css";

import type { Metadata } from "next";
import { Josefin_Sans, Source_Sans_3 } from "next/font/google";
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

const josefinSans = Josefin_Sans({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["300", "400", "600", "700"],
});

const sourceSans = Source_Sans_3({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Adventure apparel for the modern explorer",
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
				<div className="bg-foreground text-primary-foreground text-center py-2 text-xs tracking-widest uppercase">
					Free shipping and returns over $50
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-14">
							<div className="flex items-center gap-8">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-heading text-lg font-semibold tracking-wider uppercase"
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
			<body className={`${josefinSans.variable} ${sourceSans.variable} font-sans antialiased`}>
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
