import { privacy_policy } from "../../../legal-config.json";

export async function PrivacyPolicy() {
	return (
		<div className="flex flex-col gap-4">
			<br />
			{privacy_policy.text}
		</div>
	);
}
