import { UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { Navbar, type NavLink } from "@/app/navbar";
import { SearchInput } from "@/components/search/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ links, accountHref }: { links: NavLink[]; accountHref: string }) {
	return (
		<header className="sticky top-0 z-50 border-b border-[#1F2A33]/10 bg-[#F5EFE6]/85 backdrop-blur-xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-3 items-center h-16">
					<div className="flex justify-start">
						<Navbar links={links} />
					</div>
					<div className="flex justify-center">
						<Link
							href="/"
							className="headline-display text-[#1F2A33] text-base sm:text-lg tracking-[0.18em] leading-none flex items-center gap-2"
							aria-label="Your Next Store"
						>
							<span className="hidden sm:inline">YOUR NEXT STORE</span>
							<span className="sm:hidden">YNS</span>
						</Link>
					</div>
					<div className="flex items-center justify-end gap-1">
						<Suspense>
							<SearchInput />
						</Suspense>
						<ThemeToggle />
						{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
						    Static on purpose: reading the session here would pull the header out of the
						    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
						<a
							href={accountHref}
							className="inline-flex size-9 items-center justify-center rounded-full text-[#1F2A33] hover:bg-[#1F2A33]/5 transition-colors"
							aria-label="Account"
						>
							<UserRound className="size-5" />
						</a>
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
}
