import type { MDXComponents } from "mdx/types";
import Link, { type LinkProps } from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		a: (props) => <Link {...(props as LinkProps)} />,
		...components,
	};
}
