import type en from "./messages/en.json";
import type de from "./messages/de.json";

type Messages = typeof en;
type Messages = typeof de;

declare global {
	// Use type safe message keys with `next-intl`
	interface IntlMessages extends Messages {}
}
