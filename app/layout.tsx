import "@/app/globals.css";

import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
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

const headingFont = Playfair_Display({
	variable: "--font-heading",
	subsets: ["latin"],
	display: "swap",
});

const bodyFont = Source_Sans_3({
	variable: "--font-body",
	subsets: ["latin"],
	display: "swap",
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
				<div className="bg-foreground text-primary-foreground text-center text-xs tracking-widest uppercase py-2.5 px-4">
					Free shipping and returns over $50
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 sm:h-20">
							{/* Left: Nav */}
							<div className="hidden md:block flex-1">
								<Navbar />
							</div>

							{/* Center: Logo */}
							<div className="flex-shrink-0">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-heading text-xl sm:text-2xl tracking-wide uppercase font-bold"
								>
									Your Next Store
								</YnsLink>
							</div>

							{/* Right: Cart */}
							<div className="flex items-center justify-end flex-1 gap-4">
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
			<body className={`${headingFont.variable} ${bodyFont.variable} font-sans antialiased`}>
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
