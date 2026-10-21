import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Wordmark } from "@/components/wordmark";
import { getNavData, type NavItem } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const SOCIAL_LABELS: Record<string, string> = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [nav, legal, socials] = await Promise.all([
		getNavData(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const info: NavItem[] = [
		{ href: "/about", label: "About us" },
		{ href: "/products", label: "Shop" },
		{ href: "/faq", label: "FAQ" },
		...(nav.contact ? [{ href: "/contact", label: "Contact us" }] : []),
		...(nav.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	const social = Object.entries(socials?.socials ?? {})
		.filter(([key, url]) => key !== "email" && typeof url === "string" && url.length > 0)
		.map(([key, url]) => ({ href: url ?? "", label: SOCIAL_LABELS[key] ?? key }));
	return {
		nav,
		info,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		social,
		email: socials?.socials.email ?? null,
		year: new Date().getFullYear(),
	};
}

function FooterColumn({
	title,
	items,
	external = false,
}: {
	title: string;
	items: NavItem[];
	external?: boolean;
}) {
	if (items.length === 0) return null;
	return (
		<nav aria-label={title} className="min-w-0">
			<h2 className="mb-5 text-xl font-bold">{title}</h2>
			<ul className="flex flex-col gap-1.5 text-base">
				{items.map((item) => (
					<li key={item.href}>
						{external ? (
							<a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#ffb27a]">
								{item.label}
							</a>
						) : (
							<Link href={item.href} className="hover:text-[#ffb27a]">
								{item.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Decorative stand-in for the original's oversized balloon-animal artwork. */
function BalloonCluster({ className, id }: { className?: string; id: string }) {
	return (
		<svg
			viewBox="0 0 540 380"
			aria-hidden="true"
			focusable="false"
			className={`pointer-events-none absolute max-w-none ${className ?? ""}`}
		>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#ffd400" />
					<stop offset=".5" stopColor="#ff7a00" />
					<stop offset="1" stopColor="#ff1fa8" />
				</linearGradient>
			</defs>
			<g fill={`url(#${id})`}>
				<ellipse cx="120" cy="140" rx="95" ry="110" />
				<ellipse cx="300" cy="110" rx="80" ry="95" />
				<ellipse cx="450" cy="170" rx="70" ry="85" />
				<ellipse cx="250" cy="330" rx="150" ry="110" />
			</g>
			<g fill="#fff" opacity=".22">
				<ellipse cx="85" cy="90" rx="22" ry="34" />
				<ellipse cx="270" cy="70" rx="18" ry="28" />
				<ellipse cx="425" cy="125" rx="15" ry="24" />
			</g>
		</svg>
	);
}

export async function Footer() {
	const { nav, info, legal, social, email, year } = await getFooterData();

	return (
		<footer className="font-display relative w-full overflow-hidden bg-footer text-white">
			<BalloonCluster
				id="fb-wide"
				className="hidden md:-bottom-24 md:left-[max(0px,calc(50%-39.5rem))] md:block md:w-[min(30vw,380px)]"
			/>
			<div className="frame relative py-10">
				<div className="grid gap-8 md:min-h-64 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] md:gap-10">
					<div className="relative min-h-64 overflow-hidden md:static md:min-h-0 md:overflow-visible">
						<BalloonCluster id="fb-narrow" className="-bottom-36 -left-14 w-[500px] md:hidden" />
						<Wordmark
							name={nav.storeName}
							tone="white"
							className="relative z-10 text-[40px] md:text-[44px]"
						/>
						{email && (
							<p className="relative z-10 mt-6 text-base">
								<a href={`mailto:${email}`} className="hover:text-[#ffb27a]">
									{email}
								</a>
							</p>
						)}
					</div>
					<div className="grid grid-cols-2 gap-8 md:contents">
						<FooterColumn title="Categories" items={nav.categories.slice(0, 6)} />
						<FooterColumn title="Collections" items={nav.collections.slice(0, 6)} />
						<div className="flex flex-col gap-8">
							<FooterColumn title="Information" items={[...info, ...legal]} />
							<FooterColumn title="Follow us" items={social} external />
						</div>
					</div>
				</div>
				<div className="relative z-10 mt-10 flex flex-col gap-4 border-t border-white/20 pt-6 font-sans sm:flex-row sm:items-center sm:justify-between md:ml-[calc((100%-2.5rem*3)*1.4/4.4+2.5rem)]">
					<p className="text-sm">
						&copy; {year} {nav.storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
