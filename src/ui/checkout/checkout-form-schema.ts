import { object, string, type TypeOf } from "zod";

export const getAddressSchema = (tr: {
	nameRequired: string;
	cityRequired: string;
	countryRequired: string;
	line1Required: string;
	postalCodeRequired: string;
}) => {
	const addressSchema = object({
		name: string().min(1, tr.nameRequired),
		city: string().min(1, tr.cityRequired),
		country: string().min(1, tr.countryRequired),
		line1: string().min(1, tr.line1Required),
		line2: string().optional().nullable().default(""),
		postalCode: string().min(1, tr.postalCodeRequired),
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
