import Link from "next/link";
import type { Department } from "@/lib/catalog";
import { DepartmentMenu } from "./department-menu";

/**
 * The tinted strip above the masthead. The original switches between three archive
 * "houses" here; a store has one house, so the tabs are its departments. A page marks its
 * own tab active with <ActiveTab /> (no usePathname, so the chrome stays in the shell).
 */
export function HouseStrip({ departments, currency }: { departments: Department[]; currency: string }) {
	const tabs = [{ name: "All pieces", href: "/products", key: "all" }].concat(
		departments.map((department) => ({
			name: department.name,
			href: `/category/${department.slug}`,
			key: department.slug,
		})),
	);

	return (
		<div className="border-b border-line bg-tint">
			<div className="eti mx-auto flex max-w-[1240px] items-center gap-x-[22px] px-4 py-1.5 sm:px-6 sm:py-[9px]">
				<span className="hidden shrink-0 text-faint lg:inline">Departments</span>
				<nav aria-label="Departments" className="hidden min-w-0 flex-1 lg:block">
					<ul className="no-scrollbar flex gap-x-[22px] overflow-x-auto">
						{tabs.map((tab) => (
							<li key={tab.key} className="shrink-0">
								<Link
									href={tab.href}
									data-tab={tab.key}
									className="inline-block py-1 normal-case tracking-[0.08em] text-dim transition hover:text-ink"
								>
									{tab.name}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<div className="flex-1 lg:hidden">
					<DepartmentMenu tabs={tabs} />
				</div>
				<span className="shrink-0 text-faint">Prices in {currency}</span>
			</div>
		</div>
	);
}

/** Underlines the strip tab for the page that renders it (a scoped rule, no client code). */
export function ActiveTab({ tab }: { tab: string }) {
	const selector = `[data-tab="${tab.replace(/["\\]/g, "")}"]`;
	return (
		<style>{`${selector}{color:var(--acc);border-bottom:1px solid var(--acc);padding-bottom:2px}${selector}[data-menu-item]{border:0;padding-bottom:0}`}</style>
	);
}
