import { return_refund_policy } from "../../../legal-config.json";

export async function ReturnRefundPolicy() {
	return (
		<div className="flex flex-col gap-4">
			<br />
			{return_refund_policy.text}
		</div>
	);
}
