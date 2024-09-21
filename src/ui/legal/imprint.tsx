import { getTranslations } from "next-intl/server";
import { general, imprint } from "../../../legal-config.json";
import { YnsLink } from "@ui/yns-link";

export async function Imprint() {
	const t = await getTranslations("Global.legal");

	return (
		<div className="flex flex-col gap-4">
			<br />
			<p className="font-semibold text-neutral-900">{general.companyName}</p>
			<p className="text-neutral-900">
				{general.address1} <br />
				{general.address2} <br />
				{general.address3} <br />
				{t("email")}&nbsp;
				<YnsLink className="underline hover:no-underline" href={"mailto:" + general.email}>
					{general.email}
				</YnsLink>{" "}
				<br />
				{t("telephone")}&nbsp;{general.telephone} <br />
			</p>
			<div className="text-neutral-900">{imprint.text}</div>
		</div>
	);
}
