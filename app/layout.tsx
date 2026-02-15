import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter, Prompt } from "next/font/google";
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
	weight: ["400", "500", "600", "700"],
});

const prompt = Prompt({
	variable: "--font-prompt",
	subsets: ["latin"],
	weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Your Next Store | Everyday Pantry Goods",
	description:
		"Everyday pantry goods for the everyday chef. Premium sauces, spices, and seasonings crafted with care.",
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
				<div className="bg-foreground text-primary-foreground text-center text-sm font-medium py-2.5 px-4">
					<span className="font-[family-name:var(--font-prompt)] uppercase tracking-wider text-xs">
						Free shipping on orders over $50 — Hot stuff!
					</span>
				</div>

				<header className="sticky top-0 z-50 border-b-[3px] border-foreground bg-background">
					<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
						<div className="flex items-center justify-between h-[72px]">
							<div className="flex items-center gap-10">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-[family-name:var(--font-prompt)] text-2xl sm:text-3xl font-black uppercase tracking-tight"
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
				className={`${inter.variable} ${prompt.variable} font-[family-name:var(--font-inter)] antialiased`}
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
