import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
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
	variable: "--font-inter",
	subsets: ["latin"],
});

const rajdhani = Rajdhani({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store | Next-Gen Gaming Gear",
	description:
		"Experience smooth gameplay, ultra-fast load times, and elite graphics. Shop gaming PCs, peripherals, and accessories at Your Next Store.",
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
				<div className="bg-primary text-primary-foreground text-center text-xs font-semibold tracking-wider uppercase py-2.5 px-4">
					Free Shipping on Orders Over $99 — Next-Gen Gaming Starts Here
				</div>

				<header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground"
								>
									YNS
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
			<body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}>
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
