import { GemIcon, GiftIcon, HandHeartIcon, type LucideIcon, PackageIcon } from "lucide-react";
import { SectionHeading } from "@/components/grilli/section-heading";

const STRENGTHS: { icon: LucideIcon; title: string; text: string }[] = [
	{
		icon: HandHeartIcon,
		title: "From Our Kitchen",
		text: "Everything here is something our cooks use or make every service.",
	},
	{
		icon: GemIcon,
		title: "Single Origins",
		text: "Oils, vinegars and chocolate we can trace to one estate.",
	},
	{
		icon: PackageIcon,
		title: "Careful Packing",
		text: "Bottles and jars packed snugly in wood wool and card.",
	},
	{ icon: GiftIcon, title: "Made for Gifting", text: "Gift boxes and bonbons that make a generous present." },
];

/** The original's "Our Strength": four tiles in alternating blacks, the icon flipping on hover. */
export function Strengths() {
	return (
		<section aria-labelledby="strengths-title" className="py-[70px] text-center lg:py-[100px]">
			<div className="container-g">
				<SectionHeading id="strengths-title" kicker="Why Choose Us" title="Our Strength" className="mb-10" />
				<ul className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
					{STRENGTHS.map(({ icon: Icon, title, text }, index) => (
						<li key={title}>
							<div
								className={`group h-full px-5 pt-[30px] pb-10 ${index % 2 === 0 ? "bg-eerie-3" : "bg-smoky-3"}`}
							>
								<Icon
									className="mx-auto h-20 w-[100px] text-gold transition-transform duration-500 group-hover:-scale-100 group-hover:rotate-180"
									strokeWidth={0.75}
									aria-hidden="true"
								/>
								<h3 className="my-5 font-display text-title-2 text-white xl:text-[1.5625rem]">{title}</h3>
								<p className="text-label-1 leading-[1.4] text-silver">{text}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
