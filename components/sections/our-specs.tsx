import { FileTextIcon, LockIcon, SendIcon } from "lucide-react";
import { SectionTitle } from "@/components/section-title";

/** GoCart's three tinted service cards with a floating icon chip. */
export function OurSpecs({ freeShipping }: { freeShipping: string | null }) {
	const specs = [
		{
			title: freeShipping ? "Free Shipping" : "Clear Delivery",
			description: freeShipping
				? `Orders over ${freeShipping} ship free. Delivery options and costs are shown at checkout.`
				: "Delivery options and costs are shown at checkout before you pay.",
			Icon: SendIcon,
			accent: "#05DF72",
			chip: "#008236",
		},
		{
			title: "Secure Checkout",
			description: "Pay with the methods offered at checkout, over an encrypted connection.",
			Icon: LockIcon,
			accent: "#FF8904",
			chip: "#ca3500",
		},
		{
			title: "Clear Policies",
			description:
				"Shipping and return terms are listed on our policy pages, so you know them before you order.",
			Icon: FileTextIcon,
			accent: "#A684FF",
			chip: "#7f22fe",
		},
	];

	return (
		<section className="mx-auto my-20 max-w-6xl px-6">
			<SectionTitle title="Our Specifications" description="A few things to know before you shop with us." />
			<div className="mt-20 grid grid-cols-1 gap-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
				{specs.map(({ title, description, Icon, accent, chip }) => (
					<div
						key={title}
						className="group relative flex h-44 w-full flex-col items-center justify-center rounded-lg border px-8 text-center"
						style={{ backgroundColor: `${accent}10`, borderColor: `${accent}30` }}
					>
						<h3 className="font-medium text-slate-800">{title}</h3>
						<p className="mt-3 text-sm text-slate-600">{description}</p>
						<div
							className="absolute -top-5 flex size-10 items-center justify-center rounded-md text-white transition group-hover:scale-105"
							style={{ backgroundColor: chip }}
						>
							<Icon size={20} aria-hidden />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
