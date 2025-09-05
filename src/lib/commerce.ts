// Commerce SDK configuration - using YNS provider with 0.4.0 API
import { Commerce } from "commerce-kit/yns";

// Configure YNS provider for commerce operations
export const commerce = new Commerce({
	endpoint: process.env.YNS_ENDPOINT || "https://yns.cx",
	token: process.env.YNS_TOKEN || "",
});

export default commerce;
