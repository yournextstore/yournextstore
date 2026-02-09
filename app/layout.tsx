import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import "@/app/globals.css";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";

const inter = Inter({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Sneakers - Brutalist Store",
	description: "Premium sneaker store with a raw, brutalist aesthetic.",
};

function CartButtonFallback() {
	return (
		<div className="w-5 h-5 opacity-20">
			<ShoppingBag className="w-5 h-5" />
		</div>
	);
}

async function getInitialCart() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId });
		return { cart: cart ?? null, cartId };
	} catch {
		return { cart: null, cartId };
	}
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	const isStaging = process.env.YNS_API_KEY?.startsWith("sk-s-");
	const baseUrl = isStaging ? "https://yns.cx" : "https://yns.store";

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 paper-bg transition-colors duration-300">
				<main className="w-full max-w-[1400px] border border-border relative overflow-hidden shadow-2xl bg-card backdrop-blur-sm">
					{/* Brutalist Grid Header */}
					<header className="grid grid-cols-12 grid-border-b h-16 md:h-20 items-center">
						{/* Logo */}
						<div className="col-span-4 md:col-span-3 h-full flex items-center px-6 grid-border-r">
							<YnsLink href="/">
								<h1 className="font-display font-bold text-lg tracking-tighter uppercase">Sneakers</h1>
							</YnsLink>
						</div>

						{/* Navigation - Hidden on mobile */}
						<nav className="hidden md:col-span-6 md:flex h-full items-center justify-center space-x-12 grid-border-r font-medium text-sm tracking-wide">
							<Navbar />
						</nav>

						{/* Empty space on mobile */}
						<div className="col-span-4 md:hidden h-full grid-border-r" />

						{/* Icons */}
						<div className="col-span-4 md:col-span-3 h-full flex items-center justify-end px-6 space-x-6">
							<button type="button" aria-label="Search" className="hover:text-primary transition-colors">
								<Search className="w-5 h-5" />
							</button>
							<button type="button" aria-label="Favorites" className="hover:text-primary transition-colors">
								<Heart className="w-5 h-5" />
							</button>
							<Suspense fallback={<CartButtonFallback />}>
								<CartButton />
							</Suspense>
						</div>
					</header>

					{/* Page Content */}
					<div className="flex-1">{children}</div>

					{/* Footer */}
					<Footer />
					<ReferralBadge />
				</main>
			</div>
			<CartSidebar baseUrl={baseUrl} />
			<ThemeToggle />
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
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
					<Suspense fallback={null}>
						<CartProviderWrapper>{children}</CartProviderWrapper>
					</Suspense>
				</ThemeProvider>
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
