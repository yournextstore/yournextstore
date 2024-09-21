import { getTranslations } from "next-intl/server";
import { ShippingPolicy } from "@ui/legal/shipping-policy";

export default async function ImprintPage() {
	const t = await getTranslations("Global.legal");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("shippingPolicyLabel")}
			</h1>
			<ShippingPolicy />
		</article>
	);
}
