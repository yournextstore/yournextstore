import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { commerce } from "@/lib/commerce";
import "@/app/globals.css";
import { ShoppingCartIcon } from "lucide-react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Your Next Store",
	description: "Your next e-commerce store",
};

function CartButtonFallback() {
	return (
		<div className="p-2 rounded-full w-10 h-10" aria-description="Loading cart">
			<ShoppingCartIcon className="w-6 h-6 opacity-20" />
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

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<Link href="/" className="text-xl font-bold">
									Your Next Store
								</Link>
								<Suspense>
									<Navbar />
								</Suspense>
							</div>
							<Suspense fallback={<CartButtonFallback />}>
								<CartButton />
							</Suspense>
						</div>
					</div>
				</header>
				<div className="flex-1">
					<Suspense>{children}</Suspense>
				</div>
				<Footer />
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
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
			</body>
		</html>
	);
}
