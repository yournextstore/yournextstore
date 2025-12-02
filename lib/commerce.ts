import { Commerce } from "commerce-kit";

export const commerce = Commerce({
	endpoint: process.env.NEXT_PUBLIC_YNS_API_TENANT,
	token: process.env.YNS_API_KEY,
});
