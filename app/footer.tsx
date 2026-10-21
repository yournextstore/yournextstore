import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { getFooterData } from "@/lib/catalog";

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	return (
		<div className="min-w-0">
			<h2 className="caps text-copy font-semibold text-ink">{title}</h2>
			<ul className="mt-5 space-y-3">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="text-copy text-ink transition-opacity hover:opacity-70">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const { storeName, newsletter, shop, company, legal, social, year } = await getFooterData();

	return (
		<footer className="bg-background">
			<div className="mx-auto max-w-[120rem] px-6 pb-8 pt-14 lg:px-14">
				<div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
					<div className="grid grid-cols-2 gap-8 sm:flex sm:gap-24">
						<LinkColumn title="Shop" links={shop} />
						<LinkColumn title="Company" links={company} />
					</div>
					<div className="lg:w-[22rem]">
						{newsletter ? (
							<>
								<h2 className="text-title font-semibold text-ink lg:text-[1.75rem]">
									Let&rsquo;s keep in touch.
								</h2>
								<FooterNewsletter />
							</>
						) : (
							<>
								<h2 className="text-title font-semibold text-ink lg:text-[1.75rem]">Here for every body.</h2>
								<p className="mt-4 text-copy text-plum">
									Questions about a product or an order? Our answers start in the FAQ.
								</p>
								<Link href="/faq" className="link-bar mt-5 text-ink">
									Read the FAQ
								</Link>
							</>
						)}
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<PaymentMethods />
					{social.length > 0 && (
						<ul className="flex flex-wrap gap-x-6 gap-y-2">
							{social.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										target="_blank"
										rel="noreferrer"
										className="text-copy font-medium text-ink transition-opacity hover:opacity-70"
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="mt-6 flex flex-col gap-4 text-fine text-ink sm:flex-row sm:items-center sm:justify-between">
					<p>
						&copy;{year} {storeName}.
					</p>
					{legal.length > 0 && (
						<ul className="flex flex-wrap gap-x-8 gap-y-2">
							{legal.map((page) => (
								<li key={page.href}>
									<Link href={page.href} className="transition-opacity hover:opacity-70">
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</footer>
	);
}
