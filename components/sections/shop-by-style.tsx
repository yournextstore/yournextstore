import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getStyleLinks } from "@/lib/catalog";
import stylesImage from "@/public/images/styles.jpg";

/** "Shop by style": a bordered list of big uppercase links beside a photograph (desktop only). */
export async function ShopByStyle() {
	const { title, links } = await getStyleLinks();
	if (links.length === 0) return null;

	return (
		<section className="page-x w-full py-4 lg:py-8">
			<h2 className="mb-12 text-heading font-medium uppercase md:text-title">{title}</h2>
			<div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
				<ul className="h-full rounded-sm border border-border px-6 py-8 lg:px-[58px] lg:py-[52px]">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								className="group mb-8 flex w-fit items-center gap-4 border-b border-transparent pb-2 transition-colors hover:border-foreground"
							>
								<span className="text-heading font-medium uppercase md:text-title">{link.label}</span>
								<ArrowRightIcon
									aria-hidden
									className="h-6 w-6 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
									strokeWidth={1.5}
								/>
							</Link>
						</li>
					))}
				</ul>
				<div className="relative hidden lg:block">
					<Image src={stylesImage} alt="" sizes="50vw" className="h-auto w-full rounded-sm object-cover" />
				</div>
			</div>
		</section>
	);
}
