import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/images/hero.jpg";

const buttons = [
	{ label: "Shop now", href: "/products" },
	{ label: "Our story", href: "/about" },
];

/**
 * The original's split hero: photograph on the left, a bordered panel on the right with the
 * uppercase headline sitting at its foot, and two tall bordered buttons below it that fill
 * black on hover. On mobile the panel and buttons come first and the photo follows.
 */
export function Hero({ storeName }: { storeName: string }) {
	return (
		<section className="page-x mt-5 flex w-full flex-col py-4 lg:flex-row lg:py-8">
			<Image
				src={heroImage}
				alt=""
				priority
				sizes="(min-width: 1024px) 50vw, 100vw"
				className="order-2 h-auto w-full rounded-sm object-cover lg:order-1 lg:w-1/2"
			/>
			<div className="flex w-full flex-col lg:order-2 lg:w-1/2">
				<div className="flex flex-1 items-end rounded-sm border border-border px-6 pt-6">
					<div>
						<h1 className="mb-6 max-w-[652px] text-[2.5rem] font-medium uppercase leading-tight md:text-5xl">
							Worn in. Picked out. Ready again.
						</h1>
						<p className="mb-8 text-label-lg font-light">
							Secondhand denim, workwear and plain basics, picked one piece at a time by {storeName}.
						</p>
					</div>
				</div>
				<div className="flex h-[72px] font-bold uppercase lg:h-[144px]">
					{buttons.map(({ label, href }) => (
						<Link
							key={href}
							href={href}
							className="group flex h-full w-1/2 items-end justify-between rounded-sm border border-border p-6 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
						>
							<span>
								<span className="hidden group-hover:inline">#</span>
								{label}
							</span>
							<ArrowRightIcon
								aria-hidden
								className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
								strokeWidth={1.5}
							/>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
