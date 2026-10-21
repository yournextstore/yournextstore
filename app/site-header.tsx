import { Lock } from "lucide-react";
import Link from "next/link";
import { CartButton } from "@/app/cart-button";
import { MenuItems, MobileNavigation, type NavData } from "@/app/navbar";
import { HeaderSearch } from "@/components/search/header-search";

/** Full-width announcement strip: navy above the header, deep blue below it. */
export function AnnouncementBar({
	children,
	aside,
	tone = "navy",
}: {
	children: React.ReactNode;
	aside?: React.ReactNode;
	tone?: "navy" | "blue";
}) {
	return (
		<div
			className={tone === "navy" ? "bg-primary p-2 text-secondary" : "bg-banner p-2 text-banner-foreground"}
		>
			<div className="mx-auto max-w-[1400px] px-6 py-2">
				<div
					className={
						aside
							? "flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:gap-2 sm:text-left sm:text-base"
							: "text-center text-sm sm:text-base"
					}
				>
					<p>{children}</p>
					{aside}
				</div>
			</div>
		</div>
	);
}

export function Logo({ name }: { name: string }) {
	return (
		<Link href="/" className="block min-w-0 truncate text-2xl font-semibold tracking-tight md:text-3xl">
			{name}
		</Link>
	);
}

export function SiteHeader({
	shopName,
	nav,
	freeShipping,
}: {
	shopName: string;
	nav: NavData;
	freeShipping: string | null;
}) {
	return (
		<>
			<AnnouncementBar
				aside={
					<div className="hidden items-center justify-end gap-6 sm:flex">
						{/* Plain <a>: /account is a proxied zone — soft navigation 500s. */}
						<a href={nav.accountHref} className="text-sm uppercase hover:underline">
							Account
						</a>
						<Link href="/faq" className="text-sm uppercase hover:underline">
							Help Centre
						</Link>
					</div>
				}
			>
				{freeShipping ? `Free shipping on all orders over ${freeShipping}` : `Welcome to ${shopName}`}
			</AnnouncementBar>
			<header className="site-header sticky top-0 z-40 border-b border-border bg-background pb-1 shadow-sm">
				<div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 p-6 md:hidden">
					<Logo name={shopName} />
					<div className="ml-auto flex shrink-0 items-center gap-6">
						<CartButton />
						<MobileNavigation {...nav} />
					</div>
				</div>
				<div className="mx-auto hidden max-w-[1400px] p-6 md:block">
					<div className="flex items-center justify-between gap-12 py-2">
						<Logo name={shopName} />
						<div className="min-w-0 flex-1">
							<HeaderSearch />
						</div>
						<div className="hidden items-center gap-3 lg:flex">
							<Lock aria-hidden size={36} strokeWidth={2} />
							<div className="flex flex-col">
								<p className="text-primary">Secure Checkout</p>
								<p className="leading-7 text-muted-foreground">Delivery options at checkout</p>
							</div>
						</div>
						<CartButton />
					</div>
				</div>
				<div className="hidden h-px w-full bg-border md:block" />
				<div className="mx-auto hidden max-w-[1400px] px-6 md:block">
					<MenuItems {...nav} />
				</div>
			</header>
			<AnnouncementBar tone="blue">Everyday essentials, all in one place</AnnouncementBar>
			<div className="h-px w-full bg-border" />
		</>
	);
}
