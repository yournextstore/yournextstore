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
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Beautifully designed furniture and home decor, curated for modern living.",
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
				<div className="bg-foreground text-primary-foreground overflow-hidden">
					<div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
						<span className="inline-flex items-center px-8 py-2 text-xs tracking-widest uppercase">
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
						</span>
						<span className="inline-flex items-center px-8 py-2 text-xs tracking-widest uppercase">
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
							Now offering free shipping on all orders over $300! &nbsp;&nbsp;&nbsp;&#9679;&nbsp;&nbsp;&nbsp;
						</span>
					</div>
				</div>

				{/* Header */}
				<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 lg:h-20">
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="font-heading text-2xl lg:text-3xl tracking-tight"
								style={{ fontFamily: "var(--font-heading)" }}
							>
								FORMA
							</YnsLink>
							<Navbar />
							<div className="flex items-center gap-3">
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
			<body className={`${inter.variable} ${playfair.variable} antialiased`}>
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
