import type en from "./messages/en.json";

type Messages = typeof en;

declare global {
	// Use type safe message keys
	interface IntlMessages extends Messages {}
}
