"use client";

import { clearCartCookieAction } from "@/actions/cart-actions";
import { useTranslations } from "@/i18n/client";
import { useDebouncedValue } from "@/lib/hooks";
import { saveBillingAddressAction, saveShippingRateAction } from "@/ui/checkout/checkout-actions";
import { type AddressSchema, getAddressSchema } from "@/ui/checkout/checkout-form-schema";
import { ShippingRatesSection } from "@/ui/checkout/shipping-rates-section";
import { saveTaxIdAction } from "@/ui/checkout/tax-action";
import { CountrySelect } from "@/ui/country-select";
import { useDidUpdate } from "@/ui/hooks/lifecycle";
import { InputWithErrors } from "@/ui/input-errors";
import { Alert, AlertDescription, AlertTitle } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import { Checkbox } from "@/ui/shadcn/checkbox";
import { Collapsible, CollapsibleContent } from "@/ui/shadcn/collapsible";
import { Label } from "@/ui/shadcn/label";
import {
	AddressElement,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import type * as Commerce from "commerce-kit";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEventHandler, useRef, useState, useTransition } from "react";

export const StripePayment = ({
	shippingRateId,
	shippingRates,
	allProductsDigital,
	locale,
}: {
	shippingRateId?: string | null;
	shippingRates: Commerce.MappedShippingRate[];
	allProductsDigital: boolean;
	locale: string;
}) => {
	return (
		<PaymentForm
			locale={locale}
			shippingRates={shippingRates}
			cartShippingRateId={shippingRateId ?? null}
			allProductsDigital={allProductsDigital}
		/>
	);
};

const PaymentForm = ({
	shippingRates,
	cartShippingRateId,
	allProductsDigital,
	locale,
}: {
	shippingRates: Commerce.MappedShippingRate[];
	cartShippingRateId: string | null;
	allProductsDigital: boolean;
	locale: string;
}) => {
	const t = useTranslations("/cart.page.stripePayment");

	const ft = useTranslations("/cart.page.formErrors");
	const addressSchema = getAddressSchema({
		cityRequired: ft("cityRequired"),
		countryRequired: ft("countryRequired"),
		line1Required: ft("line1Required"),
		nameRequired: ft("nameRequired"),
		postalCodeRequired: ft("postalCodeRequired"),
	});

	const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof AddressSchema, string[] | null | undefined>>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isTransitioning, transition] = useTransition();
	const [isLinkAuthenticationReady, setIsLinkAuthenticationReady] = useState(false);
	const [isAddressReady, setIsAddressReady] = useState(false);
	const [isPaymentReady, setIsPaymentReady] = useState(false);
	const [billingAddressValues, setBillingAddressValues] = useState<AddressSchema>({
		name: "",
		city: "",
		country: "",
		line1: "",
		line2: "",
		postalCode: "",
		state: "",
		phone: "",
		taxId: "",
		email: "",
	});

	const [isBillingAddressPending, debouncedBillingAddress] = useDebouncedValue(billingAddressValues, 1000);
	const [shippingRateId, setShippingRateId] = useState<string | null>(cartShippingRateId);

	const [sameAsShipping, setSameAsShipping] = useState(true);
	const [email, setEmail] = useState("");

	const stripe = useStripe();
	const router = useRouter();

	// elements are mutable and can change during the lifecycle of the component
	// keep a mutable ref so that useEffects are not triggered when elements change
	const elements = useElements();
	const elementsRef = useRef(elements);
	elementsRef.current = elements;

	useDidUpdate(() => {
		transition(async () => {
			await saveBillingAddressAction({ billingAddress: debouncedBillingAddress });
			await elementsRef.current?.fetchUpdates();
			router.refresh();
		});
	}, [debouncedBillingAddress, router]);

	const readyToRender = stripe && elements && isAddressReady && isLinkAuthenticationReady && isPaymentReady;

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			console.warn("Stripe or Elements not ready");
			return;
		}
		const shippingAddressElement = elements.getElement("address");

		if (!shippingAddressElement) {
			console.warn("Address Element expected to exist but not found");
			return;
		}

		try {
			const shippingAddressObject = await shippingAddressElement.getValue();
			const shippingAddress: Partial<AddressSchema> = {
				name: shippingAddressObject.value.name,
				city: shippingAddressObject.value.address.city,
				country: shippingAddressObject.value.address.country,
				line1: shippingAddressObject.value.address.line1,
				line2: shippingAddressObject.value.address.line2,
				postalCode: shippingAddressObject.value.address.postal_code,
				state: shippingAddressObject.value.address.state,
				phone: shippingAddressObject.value.phone,
			};

			const billingAddress: Partial<AddressSchema> = sameAsShipping ? shippingAddress : billingAddressValues;

			const validatedBillingAddress = addressSchema.safeParse(billingAddress);
			const validatedShippingAddress = addressSchema.safeParse(shippingAddress);

			// when billing address form is visible we display billing errors inline under fields
			if (!validatedBillingAddress.success && !sameAsShipping) {
				setFieldErrors(validatedBillingAddress.error?.flatten().fieldErrors ?? {});
			} else {
				setFieldErrors({});
			}

			if (!validatedShippingAddress.success || !validatedBillingAddress.success) {
				console.error("Validation failed", {
					validatedShippingAddress,
					validatedBillingAddress,
				});
				setFormErrorMessage(t("fillRequiredFields"));
				return;
			}

			setIsLoading(true);
			if (validatedBillingAddress.data.taxId) {
				await saveTaxIdAction({
					taxId: validatedBillingAddress.data.taxId,
				});
			}

			const result = await stripe.confirmPayment({
				elements,
				redirect: "if_required",
				confirmParams: {
					return_url: `${window.location.origin}/order/success`,
					payment_method_data: {
						billing_details: {
							email: email ?? undefined,
							name: validatedBillingAddress.data.name,
							phone: validatedBillingAddress.data.phone ?? undefined,
							address: {
								city: validatedBillingAddress.data.city,
								country: validatedBillingAddress.data.country,
								line1: validatedBillingAddress.data.line1,
								line2: validatedBillingAddress.data.line2 ?? "",
								postal_code: validatedBillingAddress.data.postalCode,
								state: validatedBillingAddress.data.state ?? "",
							},
						},
					},
					shipping: {
						name: validatedShippingAddress.data.name,
						phone: validatedShippingAddress.data.phone ?? undefined,
						address: {
							city: validatedShippingAddress.data.city,
							country: validatedShippingAddress.data.country,
							line1: validatedShippingAddress.data.line1,
							line2: validatedShippingAddress.data.line2 ?? "",
							postal_code: validatedShippingAddress.data.postalCode,
							state: validatedShippingAddress.data.state ?? "",
						},
					},
				},
			});

			if (result.error) {
				setIsLoading(false);
				setFormErrorMessage(result.error.message ?? t("unexpectedError"));
			} else {
				// clear cart cookie after successful payment for payment methods that do not require redirect
				// for payment methods that require redirect, we clear the cookie on the success page
				await clearCartCookieAction();
				const params = new URLSearchParams({
					payment_intent: result.paymentIntent.id,
					payment_intent_client_secret: result.paymentIntent.client_secret ?? "",
				});
				router.push("/order/success?" + params.toString());
				// deliberately not setting isLoading to false here to prevent the button to flicker back to "Pay now" before redirecting
				// setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
			setFormErrorMessage(error instanceof Error ? error.message : t("unexpectedError"));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid gap-4">
			<LinkAuthenticationElement
				onReady={() => setIsLinkAuthenticationReady(true)}
				onChange={(event) => {
					if (event.complete) {
						setEmail(event.value.email);
					}
				}}
			/>
			<AddressElement
				options={{
					mode: "shipping",
					fields: { phone: "always" },
					validation: { phone: { required: "auto" } },
				}}
				onChange={(e) => {
					// do not override billing address if it's manually edited
					if (!sameAsShipping) {
						return;
					}

					if (!isAddressReady) {
						return;
					}

					setBillingAddressValues({
						name: e.value.name,
						city: e.value.address.city,
						country: e.value.address.country,
						line1: e.value.address.line1,
						line2: e.value.address.line2 ?? null,
						postalCode: e.value.address.postal_code,
						state: e.value.address.state ?? null,
						phone: e.value.phone ?? null,
						taxId: "",
						email: email,
					});
				}}
				onReady={() => setIsAddressReady(true)}
			/>

			{readyToRender && !allProductsDigital && (
				<ShippingRatesSection
					locale={locale}
					onChange={(value) => {
						transition(async () => {
							setShippingRateId(value);
							await saveShippingRateAction({ shippingRateId: value });
							await elements?.fetchUpdates();
							router.refresh();
						});
					}}
					value={shippingRateId}
					shippingRates={shippingRates}
				/>
			)}

			{readyToRender && (
				<Label
					className="flex flex-row items-center gap-x-2"
					aria-controls="billingAddressCollapsibleContent"
					aria-expanded={!sameAsShipping}
				>
					<Checkbox
						onCheckedChange={(checked) => {
							setSameAsShipping(checked === true);
						}}
						checked={sameAsShipping}
						name="sameAsShipping"
						value={sameAsShipping ? "true" : "false"}
					/>
					{allProductsDigital ? t("billingSameAsPayment") : t("billingSameAsShipping")}
				</Label>
			)}

			{readyToRender && (
				<Collapsible className="" open={!sameAsShipping}>
					<CollapsibleContent id="billingAddressCollapsibleContent" className="CollapsibleContent">
						<fieldset
							aria-hidden={sameAsShipping}
							tabIndex={sameAsShipping ? -1 : undefined}
							className={`grid gap-6 rounded-lg border p-4`}
						>
							<legend className="-ml-1 whitespace-nowrap px-1 text-sm font-medium">
								{t("billingAddressTitle")}
							</legend>
							<BillingAddressSection
								values={billingAddressValues}
								onChange={setBillingAddressValues}
								errors={fieldErrors}
							/>
						</fieldset>
					</CollapsibleContent>
				</Collapsible>
			)}

			<PaymentElement
				onReady={() => setIsPaymentReady(true)}
				options={{
					fields: {
						billingDetails: {
							address: "never",
						},
					},
				}}
			/>
			{formErrorMessage && (
				<Alert variant="destructive" className="mt-2" aria-live="polite" aria-atomic>
					<AlertCircle className="-mt-1 h-4 w-4" />
					<AlertTitle>{t("errorTitle")}</AlertTitle>
					<AlertDescription>{formErrorMessage}</AlertDescription>
				</Alert>
			)}
			{readyToRender && (
				<Button
					type="submit"
					className="w-full rounded-full text-lg"
					size="lg"
					aria-disabled={isBillingAddressPending || isLoading || isTransitioning}
					onClick={(e) => {
						if (isBillingAddressPending || isLoading || isTransitioning) {
							e.preventDefault();
						}
					}}
				>
					{isBillingAddressPending || isLoading || isTransitioning ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						t("payNowButton")
					)}
				</Button>
			)}
		</form>
	);
};

const BillingAddressSection = ({
	values,
	onChange,
	errors,
}: {
	values: AddressSchema;
	onChange: (values: AddressSchema) => void;
	errors: Record<string, string[] | null | undefined>;
}) => {
	const t = useTranslations("/cart.page.stripePayment");
	const onFieldChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.currentTarget;
		onChange({ ...values, [name]: value });
	};

	return (
		<>
			<InputWithErrors
				// required
				label={t("fullName")}
				name="name"
				defaultValue={values.name ?? undefined}
				autoComplete="shipping name"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("address1")}
				name="line1"
				defaultValue={values.line1 ?? undefined}
				autoComplete="shipping address-line1"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				label={t("address2")}
				name="line2"
				defaultValue={values.line2 ?? undefined}
				autoComplete="shipping address-line2"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<InputWithErrors
					// required
					label={t("postalCode")}
					name="postalCode"
					defaultValue={values.postalCode ?? undefined}
					autoComplete="shipping postal-code"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<InputWithErrors
					// required
					label={t("city")}
					name="city"
					defaultValue={values.city ?? undefined}
					autoComplete="shipping home city"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-1">
				<InputWithErrors
					label={t("state")}
					name="state"
					defaultValue={values.state ?? undefined}
					autoComplete="shipping address-level1"
					className="mt-3 w-full"
					errors={errors}
					onChange={onFieldChange}
				/>
				<CountrySelect
					label={t("country")}
					name="country"
					autoComplete="shipping country"
					onChangeValue={(value) => onChange({ ...values, country: value })}
					value={values.country ?? ""}
					errors={errors}
				/>
			</div>
			<InputWithErrors
				// required
				label={t("phone")}
				name="phone"
				defaultValue={values.phone ?? undefined}
				autoComplete="shipping tel"
				type="tel"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
			<InputWithErrors
				// required
				label={t("taxId")}
				name="taxId"
				defaultValue={values.taxId ?? undefined}
				autoComplete=""
				placeholder={t("taxIdPlaceholder")}
				type="text"
				className="mt-3 w-full"
				errors={errors}
				onChange={onFieldChange}
			/>
		</>
	);
};
