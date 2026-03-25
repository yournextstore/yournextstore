import "@/app/globals.css";

import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

const instrumentSans = Instrument_Sans({
	variable: "--font-body-source",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
	variable: "--font-heading-source",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Vela";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description:
			me.store.settings?.storeDescription ||
			"Beautifully designed furniture and home decor, curated for modern living.",
		icons: {
			icon: [
				{ url: faviconUrl, sizes: "any", type: "image/svg+xml" },
				{ url: faviconUrl, sizes: "192x192", type: "image/png" },
			],
			apple: [{ url: faviconUrl, sizes: "180x180" }],
			shortcut: faviconUrl,
		},
		manifest: "/manifest.webmanifest",
	};
}

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
				<div className="border-b border-border/80 bg-[var(--surface-soft)]">
					<div className="page-shell flex min-h-10 items-center justify-between gap-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
						<span>Complimentary delivery on orders over $300</span>
						<span className="hidden sm:inline">Curated for quieter, warmer interiors</span>
						<span className="hidden lg:inline">Selected pieces from independent studios</span>
					</div>
				</div>

				<header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
					<div className="page-shell">
						<div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.5rem]">
							<div className="flex min-w-0 items-center gap-4 lg:gap-8">
								<Navbar />
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-editorial text-[1.7rem] tracking-[-0.04em] text-foreground sm:text-[1.9rem]"
								>
									Vela
								</YnsLink>
							</div>
							<div className="flex items-center gap-2 sm:gap-3">
								<Suspense>
									<SearchInput />
								</Suspense>
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
			<body className={`${instrumentSans.variable} ${newsreader.variable} antialiased`}>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
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
