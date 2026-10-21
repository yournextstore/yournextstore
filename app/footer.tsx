import { cacheLife } from "next/cache";
import Link from "next/link";
import { SwagMark } from "@/components/swag/mark";
import { SwagNewsletterForm } from "@/components/swag/newsletter-form";
import { commerce } from "@/lib/commerce";
import { getStoreIdentity } from "@/lib/swag";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	youtube: "YouTube",
	x: "X",
	linkedin: "LinkedIn",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [identity, socials, legal] = await Promise.all([
		getStoreIdentity(),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const links = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials?.[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
	return {
		identity,
		socials: links,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		year: new Date().getFullYear(),
	};
}

/** The original's sky-blue footer: store pill and socials, the big mark, the newsletter pill, legal row. */
export async function Footer() {
	const { identity, socials, legal, year } = await getFooterData();

	return (
		<footer className="relative z-20 flex min-h-[80svh] flex-col justify-between bg-swag-sky text-black">
			<div className="grid flex-1 grid-cols-1 items-center gap-12 px-4 py-20 lg:grid-cols-3 lg:px-12">
				<div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-start">
					<Link
						href="/"
						className="rounded-full border border-black px-4 py-1.5 text-t14 uppercase hover:bg-black hover:text-swag-sky"
					>
						{identity.name}
					</Link>
					{socials.length > 0 && (
						<ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-t14 uppercase">
							{socials.map((social) => (
								<li key={social.href}>
									<a href={social.href} target="_blank" rel="noreferrer" className="hover:underline">
										{social.label}
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex justify-center">
					<SwagMark className="h-40 w-40 rotate-12 lg:h-48 lg:w-48" />
				</div>
				<div className="flex justify-center lg:justify-end">
					<SwagNewsletterForm />
				</div>
			</div>
			<div className="flex flex-col items-center gap-6 px-4 py-5 text-t14 uppercase lg:flex-row lg:justify-between lg:px-5">
				<ul className="flex flex-col items-center gap-x-8 gap-y-1 lg:flex-row">
					<li>
						<Link href="/about" className="hover:underline">
							About
						</Link>
					</li>
					{identity.contactEnabled && (
						<li>
							<Link href="/contact" className="hover:underline">
								Contact
							</Link>
						</li>
					)}
					<li>
						<Link href="/faq" className="hover:underline">
							FAQ
						</Link>
					</li>
					<li>
						<a href="/account" className="hover:underline">
							Account
						</a>
					</li>
					{legal.map((page) => (
						<li key={page.href}>
							<Link href={page.href} className="hover:underline">
								{page.label}
							</Link>
						</li>
					))}
				</ul>
				<p>
					{identity.name} © {year}
				</p>
			</div>
		</footer>
	);
}
