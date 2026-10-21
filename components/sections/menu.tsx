import Link from "next/link";
import { BtnLabel } from "@/components/grilli/btn-label";
import { MenuCard } from "@/components/grilli/menu-card";
import { SectionHeading } from "@/components/grilli/section-heading";
import { getHomeMenu, getStoreBasics } from "@/lib/catalog";

/** The original's "Delicious Menu", as the shop's selection: two ruled columns split by a hairline. */
export async function MenuSection() {
	const [{ menu }, { freeShipping }] = await Promise.all([getHomeMenu(), getStoreBasics()]);
	if (menu.length === 0) return null;

	return (
		<section
			aria-labelledby="menu-title"
			className="relative overflow-hidden bg-eerie bg-[radial-gradient(circle_at_15%_10%,rgb(228_197_144/0.06),transparent_40%),radial-gradient(circle_at_85%_90%,rgb(228_197_144/0.06),transparent_40%)] py-[70px] lg:py-[100px]"
		>
			<div className="container-g">
				<SectionHeading id="menu-title" kicker="Special Selection" title="Our Selection" className="mb-10" />
				<ul className="relative mb-[50px] grid gap-10 md:grid-cols-2 lg:gap-x-[90px] lg:before:absolute lg:before:inset-y-0 lg:before:left-1/2 lg:before:border-l lg:before:border-line lg:before:content-[''] xl:mb-[55px] xl:gap-x-[200px] xl:gap-y-[55px]">
					{menu.map((item) => (
						<li key={item.id}>
							<MenuCard item={item} />
						</li>
					))}
				</ul>
				{freeShipping && (
					<p className="text-center text-body-4">
						Free delivery on every order over <span className="text-gold">{freeShipping}</span>
					</p>
				)}
				<Link href="/products" className="btn-g mx-auto mt-[26px] flex">
					<BtnLabel>View All Products</BtnLabel>
				</Link>
			</div>
		</section>
	);
}
