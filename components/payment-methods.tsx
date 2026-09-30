import { PaymentIcon, type PaymentMethodId } from "commerce-kit/payment-icons";
import { cn } from "@/lib/utils";

// Card checkout on Stripe takes these everywhere; stores list their local methods (BLIK, iDEAL, …) explicitly.
const DEFAULT_METHODS: PaymentMethodId[] = ["visa", "mastercard", "amex", "apple_pay", "google_pay"];

export function PaymentMethods({
	methods = DEFAULT_METHODS,
	className,
}: {
	methods?: PaymentMethodId[];
	className?: string;
}) {
	return (
		<ul aria-label="Payment methods" className={cn("flex flex-wrap items-center gap-2", className)}>
			{methods.map((method) => (
				<li key={method}>
					<PaymentIcon method={method} className="h-6 w-auto" />
				</li>
			))}
		</ul>
	);
}
