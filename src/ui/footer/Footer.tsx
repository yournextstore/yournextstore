import { type SVGAttributes } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Categories } from "@/ui/nav/Nav";
import { deslugify } from "@/lib/utils";
import { YnsLink } from "@/ui/YnsLink";
import { Newsletter } from "@/ui/footer/Newsletter.client";

export async function Footer() {
	const t = await getTranslations("Global.footer");
	return (
		<footer className="w-full bg-neutral-50 p-6 text-neutral-800 md:py-12">
			<div className="container flex max-w-7xl flex-row flex-wrap justify-center gap-16 text-sm sm:justify-between">
				<div className="flex w-full max-w-sm flex-col gap-2">
					<h3 className="font-semibold">{t("newsletterTitle")}</h3>
					<Newsletter />
				</div>
				<Link
					href="https://vercel.com?utm_source=typeofweb&utm_campaign=oss"
					target="_blank"
					rel="noopener noreferrer"
					className="mb-4 inline-block self-center"
				>
					<span className="sr-only">Powered By Vercel</span>
					<svg fill="none" width={209} height={40}>
						<path
							fill="#000"
							d="M0 5a5 5 0 0 1 5-5h199a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V5z"
						/>
						<path fill="#fff" fillRule="evenodd" d="m20 13 8 14H12l8-14z" clipRule="evenodd" />
						<path stroke="#333" d="M40.5 0v40" />
						<path
							fill="#fff"
							d="M53.3 26H55v-4h2.4c2.7 0 4-1.7 4-3.9 0-2.1-1.3-3.7-4-3.7h-4.1V26zm1.7-5.6V16h2.2c1.8 0 2.5 1 2.5 2.2 0 1.3-.7 2.3-2.4 2.3H55zm12 5.8c2.4 0 4-1.8 4-4.5s-1.6-4.5-4-4.5c-2.5 0-4.1 1.8-4.1 4.5s1.6 4.5 4 4.5zm0-1.4c-1.7 0-2.4-1.5-2.4-3.1 0-1.7.7-3.1 2.3-3.1 1.6 0 2.4 1.4 2.4 3 0 1.7-.8 3.1-2.4 3.1zm7.5 1.2h1.8l1.7-6.3h.2l1.7 6.3h1.8l2.5-8.7h-1.7l-1.7 6.4h-.1L79 17.3h-1.8l-1.7 6.4-1.8-6.4H72l2.5 8.7zm14.8.2c2 0 3.3-1 3.7-2.4l-1.6-.3c-.3.9-1 1.3-2 1.3-1.5 0-2.5-1-2.5-2.7H93v-.6c0-3.1-1.9-4.3-3.9-4.3-2.4 0-4 1.8-4 4.5s1.6 4.5 4.1 4.5zM87 20.9c0-1.3 1-2.3 2.3-2.3 1.4 0 2.2 1 2.2 2.3H87zm8 5.1h1.8v-5.3c0-1.2.8-2 2-2l1 .1v-1.6a7 7 0 0 0-.8 0c-1 0-1.9.5-2.2 1.5v-1.4H95V26zm9.7.2c1.9 0 3.2-1 3.6-2.4l-1.6-.3c-.3.9-1 1.3-2 1.3-1.5 0-2.5-1-2.5-2.7h6.2v-.6c0-3.1-1.9-4.3-3.9-4.3-2.4 0-4 1.8-4 4.5s1.6 4.5 4.2 4.5zm-2.5-5.3c0-1.3 1-2.3 2.4-2.3 1.3 0 2.1 1 2.1 2.3h-4.5zm11.4 5.3c1.5 0 2.2-1 2.5-1.6h.1V26h1.7V14.4H116v4.3h-.1c-.3-.6-1-1.5-2.5-1.5-2.1 0-3.7 1.6-3.7 4.5 0 2.8 1.5 4.5 3.7 4.5zm.3-1.5c-1.5 0-2.3-1.3-2.3-3 0-1.8.8-3.1 2.3-3.1 1.5 0 2.3 1.2 2.3 3 0 1.9-.8 3.1-2.3 3.1zm10.8 1.3h1.6v-1.4h.2c.3.6 1 1.6 2.5 1.6 2.1 0 3.6-1.7 3.6-4.5 0-2.9-1.5-4.5-3.6-4.5-1.6 0-2.2 1-2.5 1.5h-.1v-4.3h-1.7V26zm1.6-4.4c0-1.8.8-3 2.3-3 1.6 0 2.3 1.3 2.3 3 0 1.8-.8 3.1-2.3 3.1-1.4 0-2.3-1.2-2.3-3zm9 7.6c1.4 0 2.3-.7 2.8-2l3.6-10h-1.8l-2.2 6.8h-.1l-2.2-6.7h-1.8l3.1 8.8-.2.6c-.4 1.1-1 1.2-2 1l-.3 1.4 1.1.1zm14.2-14.8h-2.7l4 11.6h3.2l4-11.6h-2.7l-2.9 8.8-2.9-8.8zm12.8 11.8c2.2 0 3.6-1 4-2.7l-2.3-.1c-.2.6-.8 1-1.6 1-1.2 0-2-.8-2-2.1h6v-.7c0-3-1.9-4.4-4.2-4.4-2.5 0-4.2 1.8-4.2 4.5s1.6 4.5 4.3 4.5zm-2-5.4a2 2 0 0 1 2-1.8c1 0 1.7.7 1.8 1.8h-3.7zm7.6 5.2h2.4v-5c0-1 .8-1.8 1.9-1.8l1 .2v-2.2h-.8c-1 0-1.7.5-2 1.6h-.1v-1.5h-2.4V26zm10 .2c2.4 0 3.9-1.4 4-3.4h-2.3c-.1 1-.7 1.5-1.6 1.5-1.1 0-1.8-1-1.8-2.7 0-1.6.7-2.6 1.8-2.6 1 0 1.5.6 1.6 1.5h2.3c-.1-2-1.6-3.3-4-3.3-2.6 0-4.2 1.8-4.2 4.5 0 2.6 1.6 4.5 4.3 4.5zm9.5 0c2.2 0 3.6-1 4-2.7l-2.3-.1c-.2.6-.8 1-1.6 1-1.3 0-2-.8-2-2.1h6v-.7c0-3-1.9-4.4-4.2-4.4-2.5 0-4.2 1.8-4.2 4.5s1.6 4.5 4.3 4.5zm-2-5.4a2 2 0 0 1 2-1.8c1 0 1.7.7 1.7 1.8h-3.6zm10-6.4H193V26h2.4V14.4z"
						/>
					</svg>
				</Link>
				<nav className="grid grid-cols-2 gap-16">
					<section>
						<h3 className="mb-2 font-semibold">{t("categoriesTitle")}</h3>
						<ul role="list" className="grid gap-1">
							{Categories.map((category) => (
								<li key={category.slug}>
									<YnsLink
										className="underline-offset-4 hover:underline"
										href={`/category/${category.slug}`}
									>
										{deslugify(category.slug)}
									</YnsLink>
								</li>
							))}
						</ul>
					</section>
					<section>
						<h3 className="mb-2 font-semibold">Support</h3>
						<ul role="list" className="grid gap-1">
							<li>
								<YnsLink
									className="underline-offset-4 hover:underline"
									href="https://yournextstore.com/#features"
								>
									Features
								</YnsLink>
							</li>
							<li>
								<YnsLink
									className="underline-offset-4 hover:underline"
									href="https://yournextstore.com/#pricing"
								>
									Pricing
								</YnsLink>
							</li>
							<li>
								<YnsLink
									className="underline-offset-4 hover:underline"
									href="mailto:hello@yournextstore.com"
								>
									Contact Us
								</YnsLink>
							</li>
						</ul>
					</section>
				</nav>
			</div>
			<div className="container mt-8 flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
				<div>
					<p>© 2024 Your Next Store.</p>
					<p>Handcrafted with passion in California.</p>
				</div>
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
