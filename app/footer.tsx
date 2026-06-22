import { cacheLife } from "next/cache";
import { FooterNewsletter } from "@/app/footer-newsletter";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

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
				className="text-sm text-background/85 hover:text-warm-tan transition-colors"
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
				className="text-sm text-background/85 hover:text-warm-tan transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [collections, legalPages] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }),
		commerce.legalPageBrowse(),
	]);

	return {
		collections: collections.data.map((c) => ({
			name: c.name,
			href: `/collection/${c.slug}`,
		})),
		legalPages: legalPages.data.map((p) => ({
			name: p.label,
			href: `/legal${p.href}`,
		})),
	};
}

export async function Footer() {
	const { collections, legalPages } = await getFooterData();

	const columns = [
		{
			title: "Customer Service",
			links: [
				{ name: "FAQ", href: "/faq" },
				{ name: "Shipping & returns", href: "/faq" },
				{ name: "Contact", href: "/faq" },
				{ name: "Track an order", href: "/order" },
			],
		},
		{
			title: "The House",
			links: [
				{ name: "Our story", href: "/" },
				{ name: "Sustainability", href: "/" },
				{ name: "Journal", href: "/" },
				{ name: "Press", href: "/" },
			],
		},
		...(collections.length > 0 ? [{ title: "Shop", links: collections }] : []),
		...(legalPages.length > 0 ? [{ title: "Legal", links: legalPages }] : []),
	];

	return (
		<footer className="bg-deep-brown text-background mt-0">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr] gap-12 pb-14 border-b border-background/15">
					<div>
						<YnsLink prefetch={"eager"} href="/" className="font-serif text-3xl tracking-[0.32em] uppercase">
							YNS
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-background/65 max-w-sm">
							Your Next Store — small-batch botanical skincare made with cold-pressed plants, beeswax, and a
							quiet, patient hand.
						</p>
						<div className="mt-8 flex items-center gap-3">
							<a
								href="https://instagram.com"
								aria-label="Instagram"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-background/25 hover:bg-background/10 transition-colors"
							>
								<span className="sr-only">Instagram</span>
								<svg
									viewBox="0 0 24 24"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<title>Instagram</title>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
								</svg>
							</a>
							<span className="text-[11px] tracking-[0.2em] uppercase text-background/60">
								@yournextstore
							</span>
						</div>
					</div>

					<div className="lg:pl-12 lg:border-l lg:border-background/15">
						<div className="font-serif text-xs tracking-[0.4em] uppercase text-warm-tan">Subscribe</div>
						<h3 className="mt-3 font-serif text-2xl sm:text-3xl">Get 15% off your first order</h3>
						<p className="mt-3 text-sm text-background/65 max-w-md">
							Quiet emails — new launches, restock alerts, and the occasional ritual.
						</p>
						<FooterNewsletter />
					</div>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12">
					{columns.map((col) => (
						<div key={col.title}>
							<h4 className="text-[11px] tracking-[0.3em] uppercase text-background/60">{col.title}</h4>
							<ul className="mt-5 space-y-3">
								{col.links.map((link) => (
									<li key={`${col.title}-${link.name}`}>
										<YnsLink
											prefetch={"eager"}
											href={link.href}
											className="text-sm text-background/85 hover:text-warm-tan transition-colors"
										>
											{link.name}
										</YnsLink>
									</li>
								))}
								{col.title === "Customer Service" && (
									<>
										<FooterContactLink />
										<FooterBlogLink />
									</>
								)}
							</ul>
						</div>
					))}
				</div>

				<div className="pt-6 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-background/50">
						© {new Date().getFullYear()} Your Next Store. Crafted with care.
					</p>
					<p className="text-[11px] tracking-[0.2em] uppercase text-background/45">
						Cold-pressed · Plant-led · Made in small batches
					</p>
				</div>
			</div>
		</footer>
	);
}
