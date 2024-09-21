import { terms_of_service } from "../../../legal-config.json";

export async function TermsOfService() {
	return (
		<div className="flex flex-col gap-4">
			<br />
			{terms_of_service.text}
		</div>
	);
}
