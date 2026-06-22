import { cacheLife } from "next/cache";
import type { SVGProps } from "react";
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
				className="text-xs uppercase tracking-[0.16em] text-white/70 hover:text-yns-yellow transition-colors"
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
				className="text-xs uppercase tracking-[0.16em] text-white/70 hover:text-yns-yellow transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
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
		<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
			{pages.data.map((page) => (
				<li key={page.id}>
					<YnsLink
						prefetch={"eager"}
						href={`/legal${page.href}`}
						className="text-xs uppercase tracking-[0.16em] text-white/70 hover:text-yns-yellow transition-colors"
					>
						{page.label}
					</YnsLink>
				</li>
			))}
		</ul>
	);
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
			<rect x="2" y="2" width="20" height="20" rx="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
		</svg>
	);
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
			<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
			<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
		</svg>
	);
}

function TiktokIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" {...props}>
			<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.85a8.16 8.16 0 0 0 4.77 1.52V6.92a4.85 4.85 0 0 1-1.84-.23z" />
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="bg-yns-blue text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
				<div className="flex justify-center gap-5 pt-4">
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:bg-white hover:text-yns-blue"
					>
						<InstagramIcon className="h-4 w-4" />
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="YouTube"
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:bg-white hover:text-yns-blue"
					>
						<YoutubeIcon className="h-4 w-4" />
					</a>
					<a
						href="https://tiktok.com"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="TikTok"
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:bg-white hover:text-yns-blue"
					>
						<TiktokIcon className="h-4 w-4" />
					</a>
				</div>

				<div className="mt-10 flex flex-col items-center gap-4 border-t border-white/15 pt-6">
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						<FooterContactLink />
						<FooterBlogLink />
					</ul>
					<FooterLegalPages />
					<p className="text-xs uppercase tracking-[0.16em] text-white/60">
						&copy; {new Date().getFullYear()} Your Next Store · Powered by{" "}
						<YnsLink
							prefetch={"eager"}
							href="https://yournextstore.com"
							className="underline underline-offset-4 hover:text-yns-yellow"
						>
							YNS
						</YnsLink>
					</p>
				</div>
			</div>
		</footer>
	);
}
