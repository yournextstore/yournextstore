import Link from "next/link";
import { CartButton } from "@/app/cart-button";
import { DesktopNav, MobileMenu, type NavData } from "@/app/navbar";

/** Centered wordmark between "○ SHOP ○ INFO" and "ACCOUNT CART (0)", ruled off with one ink line. */
export function SiteHeader({ nav, accountHref }: { nav: NavData; accountHref: string }) {
	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background">
			<div className="relative grid h-[71px] grid-cols-[1fr_auto_1fr] items-center md:h-[95px] md:px-4">
				<div className="flex h-full items-center">
					<MobileMenu nav={nav} accountHref={accountHref} />
					<DesktopNav nav={nav} />
				</div>

				<Link
					href="/"
					aria-label={`${nav.storeName}, home`}
					className="block max-w-[46vw] truncate px-2 font-logo text-[3.5rem] leading-none tracking-[0.02em] uppercase md:text-[4rem]"
				>
					{nav.storeName}
				</Link>

				<div className="flex items-center justify-end pr-2 md:pr-0">
					<Link href="/search" className="mx-2 hidden p-2 text-nav font-semibold uppercase lg:block">
						Search
					</Link>
					<a href={accountHref} className="mx-2 hidden p-2 text-nav font-semibold uppercase md:block">
						Account
					</a>
					<CartButton />
				</div>
			</div>
		</header>
	);
}
