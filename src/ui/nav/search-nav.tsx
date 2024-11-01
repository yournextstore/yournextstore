import { getTranslations } from "@/i18n/server";
import { SearchInput, SearchInputPlaceholder } from "@/ui/nav/search-input.client";
import { SearchIcon } from "lucide-react";
import { Suspense } from "react";

export const SearchNav = async () => {
	const t = await getTranslations("Global.nav.search");
	return (
		<label className="flex w-full items-center min-w-9 justify-end">
			<span className="sr-only">{t("title")}</span>
			<Suspense fallback={<SearchInputPlaceholder placeholder={t("placeholder")} />}>
				<SearchInput placeholder={t("placeholder")} />
			</Suspense>
			<SearchIcon className="xs:-ml-7 max-smb:cursor-pointer max-smb:z-10 block h-5 w-5" />
		</label>
	);
};
