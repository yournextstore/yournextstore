import { cacheLife } from "next/cache";
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
				className="text-sm text-foreground/80 hover:text-foreground transition-colors"
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
				className="text-sm text-foreground/80 hover:text-foreground transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-display text-xs font-extrabold tracking-[0.25em] uppercase text-foreground">
				Shop
			</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-display text-xs font-extrabold tracking-[0.25em] uppercase text-foreground">
				Fine print
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="relative bg-[--color-sun-pop] text-foreground border-t-2 border-foreground overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-20 pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 20% 30%, #13131655 0 2px, transparent 3px), radial-gradient(circle at 80% 70%, #13131655 0 2px, transparent 3px)",
					backgroundSize: "48px 48px",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid gap-10 grid-cols-2 sm:grid-cols-4">
					<div className="col-span-2">
						<YnsLink prefetch={"eager"} href="/" className="block">
							<span className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
								Your Next Store
							</span>
							<span className="block text-[10px] tracking-[0.3em] mt-1 font-bold">HONEY FRUIT SNACKS</span>
						</YnsLink>
						<p className="mt-5 max-w-sm text-foreground/80 text-sm leading-relaxed">
							Feel‑good fuel made with real honey, real fruit and zero junk. Crafted in a nut‑free facility,
							loved by little athletes.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[
								{
									name: "Instagram",
									path: "M12 2.16c3.2 0 3.58 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 7.38a4.62 4.62 0 1 0 0 9.24 4.62 4.62 0 0 0 0-9.24Zm0 7.62a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.85-7.83a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0Z",
								},
								{
									name: "TikTok",
									path: "M19.6 7.2a5.6 5.6 0 0 1-3.3-1.1V15a5.6 5.6 0 1 1-5.6-5.6c.4 0 .8.05 1.2.13v2.8a2.8 2.8 0 1 0 1.85 2.63V3h2.62a3 3 0 0 0 3.23 3.05V7.2Z",
								},
								{
									name: "YouTube",
									path: "M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.3 5 12 5 12 5s-6.3 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.7 19 12 19 12 19s6.3 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77c.27-1.57.4-3.16.4-4.8a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z",
								},
							].map((s) => (
								<a
									key={s.name}
									href="#"
									className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background hover:bg-[--color-melon-pop] transition-colors"
								>
									<span className="sr-only">{s.name}</span>
									<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div className="flex flex-col gap-10 sm:gap-12">
						<div>
							<h3 className="font-display text-xs font-extrabold tracking-[0.25em] uppercase text-foreground">
								Help
							</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/faq"
										className="text-sm text-foreground/80 hover:text-foreground transition-colors"
									>
										FAQ
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/products"
										className="text-sm text-foreground/80 hover:text-foreground transition-colors"
									>
										All snacks
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-sm text-foreground/80 hover:text-foreground transition-colors"
									>
										About Us
									</YnsLink>
								</li>
								<FooterContactLink />
								<FooterBlogLink />
							</ul>
						</div>
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t-2 border-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs font-bold tracking-[0.18em] uppercase">
						&copy; {new Date().getFullYear()} Your Next Store · Bee Kind, Be Fueled
					</p>
					<p className="text-xs font-bold tracking-[0.18em] uppercase opacity-70">Made with real honey</p>
				</div>
			</div>
		</footer>
	);
}
