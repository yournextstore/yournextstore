import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-xs text-muted-foreground hover:text-foreground transition-colors"
			>
				Blog
			</YnsLink>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-xs text-muted-foreground hover:text-foreground transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

export function Footer() {
	return (
		<section className="grid grid-cols-12 grid-border-b md:border-b-0">
			{/* Left column with description text */}
			<div className="col-span-12 md:col-span-4 grid-border-r p-8 md:p-12 min-h-[200px] flex items-center">
				<p className="text-xs leading-relaxed opacity-70">
					Our Sneakers Are Renowned For Their Unparalleled Quality, Comfort, And Durability. Our Products Are
					Crafted Using High-Quality Materials And Cutting-Edge Technologies That Provide Optimal Cushioning,
					Ventilation, And Support For Your Feet Throughout The Day.
				</p>
			</div>

			{/* Middle column with support links */}
			<div className="col-span-12 md:col-span-4 grid-border-r p-8 md:p-12 hidden md:flex md:items-center">
				<ul className="space-y-2">
					<li>
						<YnsLink
							prefetch={"eager"}
							href="/about"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							About Us
						</YnsLink>
					</li>
					<FooterContactLink />
					<li>
						<YnsLink
							prefetch={"eager"}
							href="/faq"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							FAQ
						</YnsLink>
					</li>
					<FooterBlogLink />
				</ul>
			</div>

			{/* Right empty column */}
			<div className="col-span-12 md:col-span-4 hidden md:block" />
		</section>
	);
}
