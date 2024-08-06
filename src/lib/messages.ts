import pick from "lodash/pick";
import type { AbstractIntlMessages } from "next-intl";

const CLIENT_MESSAGES = {
	Global: ["addToCart.actionButton", "error", "globalError", "newsletter"],
	"/cart.page": ["formErrors", "stripePayment", "summaryTable"],
};

export const pickClientMessages = (messages: AbstractIntlMessages) => {
	const keys = Object.entries(CLIENT_MESSAGES).flatMap(([key, values]) =>
		values.map((value) => `${key}.${value}`),
	);

	return pick(messages, keys);
};
