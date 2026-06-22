import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["400", "600"],
	variable: "--font-bricolage",
});

const instrument = Instrument_Sans({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-instrument",
});

const fontClasses = `${bricolage.variable} ${instrument.variable}`;

const DARK = "#321e1e";
const CREAM = "#faf4f0";

function Heading({ children }: { children: React.ReactNode }) {
	return <p className="mb-5 text-[11px] font-medium lowercase tracking-normal">{children}</p>;
}

function LinkList({ items }: { items: { text: string; href: string }[] }) {
	return (
		<ul className="flex flex-col gap-2.5">
			{items.map((it) => (
				<li key={it.text}>
					<a
						href={it.href}
						className="text-[13px] lowercase text-[#faf4f0]/80 transition-colors hover:text-[#faf4f0]"
					>
						{it.text}
					</a>
				</li>
			))}
		</ul>
	);
}

function CertBadge({ top, bottom }: { top: string; bottom: string }) {
	return (
		<div className="grid h-14 w-14 place-items-center rounded-full border border-[#faf4f0]/60 text-center text-[7px] font-medium uppercase leading-[1.1] tracking-[0.06em] text-[#faf4f0]">
			<div>
				<div>{top}</div>
				<div className="mt-0.5 opacity-70">{bottom}</div>
			</div>
		</div>
	);
}

function FrFlag() {
	return (
		<span className="inline-block h-3.5 w-5 overflow-hidden rounded-[1px]">
			<svg viewBox="0 0 3 2" preserveAspectRatio="none" className="h-full w-full">
				<rect width="1" height="2" x="0" fill="#0055A4" />
				<rect width="1" height="2" x="1" fill="#fff" />
				<rect width="1" height="2" x="2" fill="#EF4135" />
			</svg>
		</span>
	);
}

function PaymentBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
	return (
		<span
			className="inline-flex h-6 w-9 items-center justify-center rounded-[3px] text-[7px] font-bold tracking-[0.04em]"
			style={{ background: bg, color }}
		>
			{label}
		</span>
	);
}

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<a
			href="#"
			aria-label={label}
			className="grid h-9 w-9 place-items-center text-[#faf4f0]/80 transition-colors hover:text-[#faf4f0]"
		>
			{children}
		</a>
	);
}

const shopLinks = [
	{ text: "face", href: "#" },
	{ text: "body", href: "#" },
	{ text: "sets", href: "#" },
	{ text: "beauty tools", href: "#" },
];
const brandLinks = [
	{ text: "journal", href: "#" },
	{ text: "about", href: "#" },
	{ text: "body care", href: "#" },
	{ text: "active ingredients", href: "#" },
];
const infoLinks = [
	{ text: "faq", href: "#" },
	{ text: "contact", href: "#" },
	{ text: "theme features", href: "#" },
	{ text: "documentation", href: "#" },
];

export function StretchFooter() {
	return (
		<footer
			className={`${fontClasses}`}
			style={{ background: DARK, color: CREAM, fontFamily: "var(--font-instrument), sans-serif" }}
		>
			<div className="px-12">
				<div className="grid grid-cols-1 gap-10 pt-20 pb-12 md:grid-cols-[1fr_1fr_1fr_2fr_auto]">
					<div>
						<Heading>shop</Heading>
						<LinkList items={shopLinks} />
					</div>
					<div>
						<Heading>brand</Heading>
						<LinkList items={brandLinks} />
					</div>
					<div>
						<Heading>info</Heading>
						<LinkList items={infoLinks} />
					</div>
					<div className="max-w-md">
						<Heading>about</Heading>
						<p className="text-[13px] leading-[1.55] text-[#faf4f0]/80">
							Nüssa Cosmetics is a top-of-the-range organic and natural brand for all skin types, handmade in
							the South of France and respectful of nature. Thanks to{" "}
							<a href="#" className="underline underline-offset-2 hover:no-underline">
								Nüssa
							</a>{" "}
							for allowing us to use their products and content in this demo.
						</p>
					</div>
					<div className="flex items-start gap-2">
						<CertBadge top="Bio" bottom="Cosmos Organic" />
						<CertBadge top="Nat" bottom="Cosmos Natural" />
						<CertBadge top="Eco" bottom="Cert" />
					</div>
				</div>

				<div className="border-t border-[#faf4f0]/15" />

				<div className="overflow-hidden py-10">
					<svg
						viewBox="0 0 381 49"
						preserveAspectRatio="xMidYMid meet"
						aria-hidden="true"
						className="block w-full"
						fill="none"
					>
						<g fill={CREAM}>
							<path d="M331.01 47.199V1.29736H340.322V19.5269H371.207V1.29736H380.518V47.199H371.207V27.3957H340.322V47.199H331.01Z" />
							<path d="M297.329 48.248C280.739 48.248 269.657 38.6743 269.657 24.248C269.657 9.82182 280.739 0.248047 297.329 0.248047C313.919 0.248047 325.001 8.64149 325.001 21.2972H315.558C315.099 12.9038 307.821 8.05133 297.329 8.05133C286.312 8.05133 278.968 14.0841 278.968 24.248C278.968 34.412 286.312 40.3792 297.329 40.3792C307.886 40.3792 315.165 35.5923 315.558 27.1989H325.001C325.001 39.8546 313.919 48.248 297.329 48.248Z" />
							<path d="M238.27 47.199V9.10064H215.975V1.29736H269.942V9.10064H247.582V47.199H238.27Z" />
							<path d="M168.093 47.199V1.29736H211.371V9.10064H177.404V20.2482H210.781V27.5269H177.404V39.3302H211.371V47.199H168.093Z" />
							<path d="M108.984 47.199V1.29736H145.049C154.558 1.29736 159.804 6.41212 159.804 13.4285C159.804 20.7728 153.902 24.9695 145.049 24.9695H140.197C151.017 25.6908 155.279 32.2482 163.148 47.199H152C143.476 31.9203 141.377 27.7236 133.181 27.7236H118.23L118.295 47.199H108.984ZM118.23 20.117H142.754C148.197 20.117 150.492 18.1498 150.492 14.8056C150.492 10.74 148.131 8.9695 142.754 8.9695H118.164L118.23 20.117Z" />
							<path d="M73.3664 47.199V9.10064H51.0713V1.29736H105.039V9.10064H82.6779V47.199H73.3664Z" />
							<path d="M25.8799 48.248C10.2078 48.248 0.0438771 41.8874 0.240599 32.5103H9.94552C9.87994 36.9694 15.3881 40.3792 25.1586 40.3792C35.5849 40.4448 42.2078 38.6087 42.2078 33.8874C42.2078 22.7398 1.15863 34.412 1.15863 14.871C1.15863 5.49395 10.9291 0.248047 25.0931 0.248047C40.1094 0.248047 50.1422 6.41198 50.2734 15.9858H40.5685C40.634 11.4612 35.3226 8.1169 25.7488 8.05133C16.3717 8.05133 10.6013 9.88739 10.6013 14.1497C10.6013 24.3136 51.5849 13.4284 51.5849 33.5595C51.5849 42.9366 41.1586 48.248 25.8799 48.248Z" />
						</g>
					</svg>
				</div>

				<div className="flex flex-col items-center justify-between gap-6 pb-10 md:flex-row">
					<div className="flex items-center gap-5">
						<button
							type="button"
							className="inline-flex items-center gap-2 text-[11px] font-medium lowercase text-[#faf4f0]/80 hover:text-[#faf4f0]"
						>
							<FrFlag />
							france (eur €)
							<svg viewBox="0 0 10 9" width="9" height="9" fill="none" aria-hidden="true">
								<path stroke="currentColor" strokeWidth="1.5" d="m1 2.5 4 4 4-4" />
							</svg>
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 text-[11px] font-medium lowercase text-[#faf4f0]/80 hover:text-[#faf4f0]"
						>
							english
							<svg viewBox="0 0 10 9" width="9" height="9" fill="none" aria-hidden="true">
								<path stroke="currentColor" strokeWidth="1.5" d="m1 2.5 4 4 4-4" />
							</svg>
						</button>
					</div>

					<div className="flex flex-col items-center gap-3 text-[11px] text-[#faf4f0]/60 md:flex-row md:gap-6">
						<span>© 2026 — Stretch Theme Sand · Powered by Shopify</span>
						<div className="flex items-center gap-1.5">
							<PaymentBadge label="VISA" bg="#1A1F71" color="#fff" />
							<PaymentBadge label="MC" bg="#EB001B" color="#fff" />
							<PaymentBadge label="AMEX" bg="#2E77BB" color="#fff" />
							<PaymentBadge label="PP" bg="#003087" color="#fff" />
							<PaymentBadge label="DC" bg="#fff" color="#0079BE" />
							<PaymentBadge label="DISC" bg="#FF6000" color="#fff" />
						</div>
					</div>

					<div className="flex items-center gap-1">
						<SocialIcon label="Facebook">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
								<path
									fillRule="evenodd"
									d="M2 12c0 4.95 3.6 9.05 8.35 9.9V14.8H7.9V12h2.45V9.8c0-2.5 1.6-3.9 3.9-3.9.7 0 1.5.1 2.2.2v2.55h-1.3c-1.2 0-1.5.6-1.5 1.4V12h2.65l-.45 2.8h-2.2v7.1C18.4 21.05 22 16.95 22 12c0-5.5-4.5-10-10-10S2 6.5 2 12Z"
									clipRule="evenodd"
								/>
							</svg>
						</SocialIcon>
						<SocialIcon label="Instagram">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M12 2.4c-2.6 0-2.93.01-3.96.06-1.02.05-1.72.21-2.33.45a4.7 4.7 0 0 0-1.7 1.1c-.54.54-.87 1.07-1.11 1.7-.24.62-.4 1.31-.45 2.34C2.41 9.07 2.4 9.39 2.4 12s.01 2.93.06 3.96c.05 1.02.21 1.72.45 2.33a4.7 4.7 0 0 0 1.1 1.7c.54.54 1.07.87 1.7 1.11.62.24 1.31.4 2.34.45 1.02.05 1.35.06 3.96.06s2.93-.01 3.96-.06c1.02-.05 1.72-.21 2.33-.45a4.7 4.7 0 0 0 1.7-1.1 4.7 4.7 0 0 0 1.11-1.7c.24-.62.4-1.31.45-2.34.05-1.02.06-1.35.06-3.96s-.01-2.93-.06-3.96c-.05-1.02-.21-1.72-.45-2.33a4.7 4.7 0 0 0-1.1-1.7 4.7 4.7 0 0 0-1.7-1.11c-.62-.24-1.31-.4-2.34-.45C14.93 2.41 14.61 2.4 12 2.4Zm0 1.73c2.56 0 2.87.01 3.88.06.94.04 1.44.2 1.78.33.45.17.77.38 1.1.72.34.34.55.66.72 1.1.13.34.29.85.33 1.79.05 1.01.06 1.32.06 3.87s-.01 2.87-.06 3.88c-.04.94-.2 1.44-.33 1.78a2.97 2.97 0 0 1-.72 1.1 2.97 2.97 0 0 1-1.1.72c-.34.13-.85.29-1.79.33-1.01.05-1.31.06-3.87.06s-2.87-.01-3.88-.06c-.94-.04-1.45-.2-1.79-.33a2.97 2.97 0 0 1-1.1-.72 2.97 2.97 0 0 1-.72-1.1c-.13-.34-.29-.85-.33-1.79C4.13 14.87 4.13 14.56 4.13 12s.01-2.87.06-3.88c.04-.94.2-1.45.33-1.79.17-.44.38-.76.72-1.1a2.97 2.97 0 0 1 1.1-.72c.34-.13.85-.29 1.79-.33 1.01-.05 1.32-.06 3.87-.06Zm0 2.96A4.91 4.91 0 1 0 12 17a4.91 4.91 0 0 0 0-9.82Zm0 8.1A3.18 3.18 0 1 1 12 8.82a3.18 3.18 0 0 1 0 6.37Zm5.08-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"
								/>
							</svg>
						</SocialIcon>
						<SocialIcon label="Pinterest">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
								<path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.85 6.36 9.32-.09-.79-.17-2 .03-2.86.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.49c0-1.4.81-2.44 1.82-2.44.86 0 1.27.65 1.27 1.42 0 .86-.55 2.16-.84 3.36-.24 1 .5 1.82 1.5 1.82 1.79 0 3.17-1.89 3.17-4.62 0-2.42-1.74-4.11-4.22-4.11-2.87 0-4.56 2.15-4.56 4.38 0 .87.33 1.8.75 2.3.08.1.09.19.07.29l-.27 1.12c-.04.18-.14.22-.33.13-1.23-.57-2-2.37-2-3.81 0-3.1 2.25-5.95 6.49-5.95 3.4 0 6.05 2.43 6.05 5.67 0 3.38-2.13 6.1-5.09 6.1-.99 0-1.93-.51-2.25-1.12l-.61 2.34c-.22.86-.82 1.94-1.22 2.6.92.28 1.89.44 2.91.44 5.52 0 10-4.48 10-10S17.52 2 12 2Z" />
							</svg>
						</SocialIcon>
						<SocialIcon label="TikTok">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
								<path d="M19.6 6.32c-1.5-.1-2.86-.92-3.7-2.18-.3-.45-.5-.97-.6-1.51-.05-.21-.05-.42-.05-.63h-3.7v13.06c0 1.34-1.08 2.42-2.42 2.42a2.42 2.42 0 1 1 .69-4.74V8.93a6.13 6.13 0 1 0 5.43 6.07V9.61a8.06 8.06 0 0 0 4.35 1.27V7.16a4.43 4.43 0 0 1 0-.84Z" />
							</svg>
						</SocialIcon>
						<SocialIcon label="LinkedIn">
							<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
								<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34v-7.7H5.78v7.7h2.56ZM7.06 9.5a1.49 1.49 0 1 0 0-2.97 1.49 1.49 0 0 0 0 2.97Zm11.28 8.84v-4.43c0-2.38-1.27-3.49-2.97-3.49-1.37 0-1.99.76-2.33 1.29v-1.11H10.5c.03.72 0 7.7 0 7.7h2.55v-4.3c0-.23.02-.46.08-.62.18-.46.6-.94 1.31-.94.93 0 1.3.71 1.3 1.74v4.12h2.6Z" />
							</svg>
						</SocialIcon>
					</div>
				</div>
			</div>
		</footer>
	);
}
