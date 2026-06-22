import { HeartIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import type { NavLink } from "@/app/navbar";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { AuthButton } from "@/components/auth-button";
import { YnsLink } from "@/components/yns-link";
import { AUTH_ENABLED } from "@/lib/auth-config";

export function SiteHeader({ links }: { links: NavLink[] }) {
	return (
		<header className="sticky top-0 z-50 bg-[#fbf8f2]/95 backdrop-blur-md border-b border-border/60">
			{/* Announcement bar */}
			<div className="bg-cream text-ink">
				<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between text-[11px] sm:text-xs tracking-[0.08em] uppercase">
					<div className="hidden sm:block w-32" />
					<p className="text-center flex-1 text-ink/80">
						<span className="hidden sm:inline">3 for 2 on all full price Mini styles. Ends soon. </span>
						<span>Use code </span>
						<span className="font-semibold text-ink">YNS-SS26</span>
					</p>
					<div className="hidden sm:flex items-center gap-2 w-32 justify-end">
						<span className="inline-block h-3 w-4 rounded-[1px] overflow-hidden relative border border-ink/15">
							<span className="absolute inset-0 bg-[#bf0a30]" />
							<span className="absolute inset-x-0 top-0 h-1.5 bg-white" />
							<span className="absolute inset-x-0 top-0 h-[3px] bg-[#002868]" />
						</span>
						<span className="text-ink/80">USA (USD)</span>
					</div>
				</div>
			</div>

			{/* Main nav row */}
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="flex items-center justify-between h-16">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-serif text-2xl tracking-[0.16em] text-ink shrink-0"
					>
						YOUR&nbsp;NEXT&nbsp;STORE
					</YnsLink>

					<Navbar links={links} />

					<div className="flex items-center gap-1 sm:gap-2">
						<Suspense>
							<SearchInput />
						</Suspense>
						<YnsLink
							prefetch="eager"
							href="/products"
							aria-label="Account"
							className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-cream transition-colors"
						>
							<UserIcon className="h-5 w-5" strokeWidth={1.5} />
						</YnsLink>
						<YnsLink
							prefetch="eager"
							href="/products"
							aria-label="Wishlist"
							className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:text-ink hover:bg-cream transition-colors"
						>
							<HeartIcon className="h-5 w-5" strokeWidth={1.5} />
						</YnsLink>
						{AUTH_ENABLED && <AuthButton />}
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
}
