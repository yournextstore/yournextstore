import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
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

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store - Automotive Parts & Accessories",
	description: "Premium automotive parts, accessories, and performance upgrades for every vehicle.",
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
				{/* Top utility bar */}
				<div className="bg-[#1a1a1a] text-white/70 text-xs">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
						<span className="hidden sm:inline">Helpline: (+800) 123 456 7890</span>
						<div className="flex items-center gap-4 ml-auto">
							<YnsLink prefetch={"eager"} href="/products" className="hover:text-white transition-colors">
								Track your order
							</YnsLink>
						</div>
					</div>
				</div>

				{/* Main header */}
				<header className="sticky top-0 z-50 bg-[#222222] shadow-lg">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-heading text-2xl font-bold text-white uppercase tracking-wider"
								>
									Your Next Store
								</YnsLink>
							</div>
							<div className="flex items-center gap-4">
								<Navbar />
								<CartButton />
							</div>
						</div>
					</div>
				</header>

				{/* Yellow navigation bar */}
				<div className="bg-brand text-brand-foreground font-heading">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center h-12 gap-6 text-sm font-semibold uppercase tracking-wide overflow-x-auto">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="whitespace-nowrap hover:opacity-80 transition-opacity"
							>
								Shop All
							</YnsLink>
							<Suspense>
								<NavCollections />
							</Suspense>
						</div>
					</div>
				</div>

				<div className="flex-1">{children}</div>
				<Footer />
				<ReferralBadge />
			</div>
			<CartSidebar />
		</CartProvider>
	);
}

async function NavCollections() {
	const collections = await commerce.collectionBrowse({ limit: 5 });
	return collections.data.map((collection) => (
		<YnsLink
			prefetch={"eager"}
			key={collection.id}
			href={`/collection/${collection.slug}`}
			className="whitespace-nowrap hover:opacity-80 transition-opacity"
		>
			{collection.name}
		</YnsLink>
	));
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}>
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
