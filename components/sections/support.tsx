import Link from "next/link";
import { SectionHead } from "@/components/field/section-head";
import { GRID_REFS, getFieldCatalog } from "@/lib/field";

export async function Support() {
	const { freeShipping } = await getFieldCatalog();
	const plans = [
		{
			name: "Checkout",
			price: "Secure",
			unit: null,
			items: ["Cards and wallets", "Order confirmation by email", "Discount codes at the till"],
		},
		{
			name: "Shipping",
			price: freeShipping ? "Free" : "At checkout",
			unit: freeShipping ? `/ over ${freeShipping}` : null,
			items: ["Rates shown before you pay", "Delivery options at checkout", "Store policies in the footer"],
		},
		{
			name: "Your account",
			price: "Included",
			unit: null,
			items: ["Order history in one place", "Saved addresses", "Sign in with a one-time code"],
		},
	];

	return (
		<section id="support" className="section-x section-y">
			<SectionHead
				gridRef={GRID_REFS[4]}
				eyebrow="AFTER THE CHECKOUT"
				title={
					<>
						Order placed.
						<br />
						Everything in one place.
					</>
				}
				lead="Every order comes with the basics: a secure checkout, clear delivery options and an account to keep track of it after."
			/>
			<div className="frame mb-[2.6rem] grid overflow-hidden rounded-[2px] border border-line md:grid-cols-3">
				{plans.map((plan, i) => (
					<article
						key={plan.name}
						className="border-line p-[clamp(22px,3vw,32px)] not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
					>
						<p
							className={`font-field mb-4 text-[0.76rem] font-bold tracking-[0.14em] uppercase ${i === 2 ? "text-signal" : "text-dim"}`}
						>
							{plan.name}
						</p>
						<p className="font-display mb-[1.4rem] text-[2.4rem] text-ink">
							{plan.price}
							{plan.unit && (
								<span className="font-field ml-1 text-[0.9rem] tracking-normal text-faint normal-case">
									{plan.unit}
								</span>
							)}
						</p>
						<ul className="flex flex-col gap-[11px]">
							{plan.items.map((item) => (
								<li key={item} className="relative pl-5 text-[0.94rem] text-dim">
									<span
										aria-hidden="true"
										className="absolute top-[.5em] left-0 h-2 w-2 rotate-45 rounded-[1px] border-[1.5px] border-signal"
									/>
									{item}
								</li>
							))}
						</ul>
					</article>
				))}
			</div>
			<div className="frame flex flex-wrap gap-3.5">
				<Link href="/faq" className="btn btn-primary">
					Read the FAQ
				</Link>
				<Link href="/about" className="btn btn-ghost">
					About us
				</Link>
			</div>
		</section>
	);
}
