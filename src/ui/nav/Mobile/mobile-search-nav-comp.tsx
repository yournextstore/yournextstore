import { Suspense } from "react";
import { SearchIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
	MobileSearchInput,
	MobileSearchInputPlaceholder,
} from "@/ui/nav/Mobile/mobile-search-input.client";

export const MobileSearchNavComponent = async () => {
	const t = await getTranslations("Global.nav.search");
	return (
		<label className="flex w-full items-center">
			<span className="sr-only">{t("title")}</span>
			<Suspense fallback={<MobileSearchInputPlaceholder placeholder={t("placeholder")} />}>
				<MobileSearchInput placeholder={t("placeholder")} />
			</Suspense>
			<SearchIcon className="-ml-7 block h-5 w-5" />
		</label>
	);
};
