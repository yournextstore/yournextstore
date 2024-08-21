import * as Commerce from "commerce-kit";
import { CartSummaryNav } from "@/ui/nav/CartSummaryNav";
import { SeoH1 } from "@/ui/SeoH1";
import { SearchNav } from "@/ui/nav/SearchNav";
import { NavMenu } from "@/ui/nav/NavMenu";
import { YnsLink } from "@/ui/YnsLink";

export const Nav = async () => {
	const { config } = await Commerce.contextGet();

	return (
		<header className="border-b py-4">
			<div className="sm:items-centerm mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6 md:flex-nowrap lg:px-8">
				<YnsLink href="/">
					<SeoH1 className="-mt-0.5 whitespace-nowrap text-xl font-bold">{config.nav.title}</SeoH1>
				</YnsLink>

				<div className="sm:mr-auto">
					<NavMenu links={config.nav.links} />
				</div>

				<div className="flex items-center justify-start gap-x-6">
					{config.nav.searchBar.show && <SearchNav />}
					<CartSummaryNav />
				</div>
			</div>
		</header>
	);
};
