import { YnsProvider } from "commerce-kit";
import { invariant } from "./lib";

invariant(process.env.YNS_API_TENANT, "Missing env.YNS_API_TENANT");
invariant(process.env.YNS_API_TOKEN, "Missing env.YNS_API_TOKEN");
export const ynsClient = new YnsProvider({
	endpoint: process.env.YNS_API_TENANT,
	token: process.env.YNS_API_TOKEN,
	version: "v1",
});
