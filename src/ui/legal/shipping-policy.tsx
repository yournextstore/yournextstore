import { shipping_policy } from "../../../legal-config.json";

export async function ShippingPolicy() {
	return (
		<div className="flex flex-col gap-4">
			<br />
			{shipping_policy.text}
		</div>
	);
}
