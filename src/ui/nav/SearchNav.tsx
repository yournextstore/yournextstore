import { Suspense } from "react";
import { SearchIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SearchInput, SearchInputPlaceholder } from "@/ui/nav/SearchInput.client";

export const SearchNav = async () => {
	const t = await getTranslations("Global.nav.search");
	return (
		<label className="flex w-full items-center">
			<span className="sr-only">{t("title")}</span>
			<Suspense fallback={<SearchInputPlaceholder placeholder={t("placeholder")} />}>
				<SearchInput placeholder={t("placeholder")} />
			</Suspense>
			<SearchIcon className="-ml-7 block h-5 w-5" />
		</label>
	);
};
