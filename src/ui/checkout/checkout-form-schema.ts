import { type TypeOf, object, string } from "zod";

export const getAddressSchema = (tr: {
	nameRequired: string;
	cityRequired: string;
	countryRequired: string;
	line1Required: string;
	postalCodeRequired: string;
}) => {
	const addressSchema = object({
		name: string({ required_error: tr.nameRequired }).min(1, tr.nameRequired),
		city: string({ required_error: tr.cityRequired }).min(1, tr.cityRequired),
		country: string({ required_error: tr.countryRequired }).min(1, tr.countryRequired),
		line1: string({ required_error: tr.line1Required }).min(1, tr.line1Required),
		line2: string().optional().nullable().default(""),
		postalCode: string({ required_error: tr.postalCodeRequired }).min(1, tr.postalCodeRequired),
		state: string().optional().nullable().default(""),
		phone: string().optional().nullable().default(""),
		taxId: string().optional().nullable().default(""),
		email: string().optional().nullable().default(""),
		// 	.email("Email is required")
		// 	.min(1, "Email is required"),
	});
	return addressSchema;
};

export type AddressSchema = TypeOf<ReturnType<typeof getAddressSchema>>;
