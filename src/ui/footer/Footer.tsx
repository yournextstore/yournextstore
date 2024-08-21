import { type SVGAttributes } from "react";
import { getTranslations } from "next-intl/server";
import * as Commerce from "commerce-kit";
import { YnsLink } from "@/ui/YnsLink";
import { Newsletter } from "@/ui/footer/Newsletter.client";

export async function Footer() {
	const t = await getTranslations("Global.footer");

	const { config } = await Commerce.contextGet();

	return (
		<footer className="w-full bg-neutral-50 p-6 text-neutral-800 md:py-12">
			<div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
				<div className="">
					{config.footer.newsletter.show && (
						<div className="flex w-full max-w-sm flex-col gap-2">
							<h3 className="font-semibold">{t("newsletterTitle")}</h3>
							<Newsletter />
						</div>
					)}
				</div>

				<nav className="grid grid-cols-2 gap-16">
					{config.footer.sections.map((section) => (
						<section key={section.header}>
							<h3 className="mb-2 font-semibold">{section.header}</h3>
							<ul role="list" className="grid gap-1">
								{section.links.map((link) => (
									<li key={link.label}>
										<YnsLink className="underline-offset-4 hover:underline" href={link.href}>
											{link.label}
										</YnsLink>
									</li>
								))}
							</ul>
						</section>
					))}
				</nav>
			</div>
			<div className="container mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
				<div>
					<p>© 2024 {config.footer.name}.</p>
					<p>{config.footer.tagline}</p>
				</div>
				{config.footer.credits && (
					<div className="flex items-center gap-4">
						<YnsLink
							className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700"
							href="https://x.com/zaiste"
						>
							<TwitterIcon className="h-4 w-4" /> @zaiste
							<span className="sr-only">Twitter</span>
						</YnsLink>
						<YnsLink
							className="inline-flex items-center gap-1 transition-colors hover:text-neutral-700"
							href="https://x.com/typeofweb"
						>
							<TwitterIcon className="h-4 w-4" /> @typeofweb
							<span className="sr-only">Twitter</span>
						</YnsLink>
					</div>
				)}
			</div>
		</footer>
	);
}

function TwitterIcon(props: SVGAttributes<SVGSVGElement>) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 596 596" fill="none">
			<path
				fill="#fff"
				d="m1 19 230 307L0 577h52l203-219 164 219h177L353 252 568 19h-52L329 221 179 19H1Zm77 38h82l359 481h-81L78 57Z"
			/>
		</svg>
	);
}
