import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CartProvider } from "@/app/[locale]/cart/cart-context";
import { CartSidebar } from "@/app/[locale]/cart/cart-sidebar";
import { CartButton } from "@/app/[locale]/cart-button";
import { Footer } from "@/app/[locale]/footer";
import { Navbar } from "@/app/[locale]/navbar";
import { SearchInput } from "@/app/[locale]/search-input";
import { CurrencyProvider } from "@/components/currency-provider";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ReferralBadge } from "@/components/referral-badge";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { type Currency, getActiveCurrency } from "@/lib/currency";
import { StoreJsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function CartProviderWrapper({ children, locale }: { children: React.ReactNode; locale: string }) {
	const [{ cart, cartId }, t, me, currency, messages] = await Promise.all([
		getInitialCart(),
		getTranslations({ locale, namespace: "Footer" }),
		commerce.meGet(),
		getActiveCurrency(locale),
		import(`@/messages/${locale}.json`).then((m) => m.default),
	]);

	const defaultLocale = me.store.locale;
	const enabledLanguages = me.store.settings?.enabledLanguages;
	const extraLocales = enabledLanguages
		? Object.entries(enabledLanguages)
				.filter(([, enabled]) => enabled)
				.map(([loc]) => loc)
		: [];
	const enabledLocales = [defaultLocale, ...extraLocales.filter((l) => l !== defaultLocale)];

	const defaultCurrencyFromStore = me.store.currency;
	const extraCurrencies = me.store.settings?.enabledCurrencies ?? [];
	const enabledCurrencies = [
		defaultCurrencyFromStore,
		...extraCurrencies.filter((c) => c !== defaultCurrencyFromStore),
	];

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<CurrencyProvider defaultCurrency={currency as Currency}>
				<CartProvider initialCart={cart} initialCartId={cartId}>
					<div className="flex min-h-screen flex-col">
						<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex items-center justify-between h-16">
									<div className="flex items-center gap-8">
										<Link prefetch={true} href="/" className="text-xl font-bold">
											{t("storeName")}
										</Link>
										<Navbar locale={locale} currency={currency} />
									</div>
									<div className="flex items-center gap-2">
										<Suspense>
											<SearchInput />
										</Suspense>
										<LocaleSwitcher locales={enabledLocales} />
										<CurrencySwitcher currencies={enabledCurrencies} />
										<CartButton />
									</div>
								</div>
							</div>
						</header>
						<div className="flex-1">{children}</div>
						<Footer locale={locale} currency={currency} />
						<ReferralBadge />
					</div>
					<CartSidebar />
				</CartProvider>
			</CurrencyProvider>
		</NextIntlClientProvider>
	);
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const env = process.env.VERCEL_ENV || "development";

	return (
		<>
			<Suspense>
				<StoreJsonLd />
			</Suspense>
			<Suspense
				fallback={
					<div className="flex min-h-screen flex-col">
						<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="h-16" />
							</div>
						</header>
						<div className="flex-1" />
					</div>
				}
			>
				<CartProviderWrapper locale={locale}>{children}</CartProviderWrapper>
			</Suspense>
			{env === "development" && (
				<>
					<NavigationReporter />
					<ErrorOverlayRemover />
				</>
			)}
		</>
	);
}
