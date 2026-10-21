import type { ComponentPropsWithoutRef } from "react";

// Line icons ported from Agilo/fashion-starter (MIT, see NOTICE.md). Thin 1.5px strokes drawn
// as filled paths, which is what gives the theme its light, editorial header.

type IconProps = ComponentPropsWithoutRef<"svg">;

export function BagIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M18.5 8.875h-13v10h13v-10ZM4 7.375v13h16v-13H4Z"
				clipRule="evenodd"
			/>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M9.75 8.376 9 8.375h-.75v-.021a3.367 3.367 0 0 1 .007-.191c.007-.124.02-.298.046-.506.051-.411.155-.973.37-1.545.213-.57.551-1.19 1.094-1.673.559-.496 1.299-.814 2.233-.814.934 0 1.674.318 2.233.814.543.483.88 1.103 1.094 1.673.215.572.319 1.134.37 1.545a7.23 7.23 0 0 1 .052.654v.043l.001.014v.006l-.75.001h-.75V8.35l-.005-.106a5.717 5.717 0 0 0-.036-.4 5.413 5.413 0 0 0-.286-1.205c-.162-.43-.386-.81-.687-1.077-.285-.254-.67-.436-1.236-.436s-.951.182-1.236.436c-.3.267-.525.647-.687 1.077-.16.428-.244.866-.286 1.205a5.728 5.728 0 0 0-.04.506l-.001.024v.003Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function UserIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M12 4.125a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Zm-5.75 4.25a5.75 5.75 0 1 1 11.5 0 5.75 5.75 0 0 1-11.5 0Z"
				clipRule="evenodd"
			/>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M5.813 15.188a8.75 8.75 0 0 1 14.937 6.187h-1.5a7.25 7.25 0 1 0-14.5 0h-1.5a8.75 8.75 0 0 1 2.563-6.187Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function SearchIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M9.694 2.445a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5Zm-8.75 7.25a8.75 8.75 0 1 1 17.5 0 8.75 8.75 0 0 1-17.5 0Z"
				clipRule="evenodd"
			/>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="m15.694 14.634 5.361 5.36-1.06 1.061-5.361-5.36 1.06-1.061Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function MenuIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M2.25 5.095h19.5v1.5H2.25v-1.5Zm0 6h19.5v1.5H2.25v-1.5Zm0 6h19.5v1.5H2.25v-1.5Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function CloseIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				stroke="currentColor"
				strokeLinecap="square"
				strokeLinejoin="round"
				d="m18.354 6-5.293 5.293-.354-.354L18 5.646l.354.354ZM6 5.646l5.293 5.293-.353.354L5.647 6 6 5.646Zm6 6 .354.354-.354.354-.353-.354.353-.354Zm.707 1.415.354-.354L18.354 18l-.354.354-5.293-5.293Zm-1.768-.354.354.354L6 18.354 5.647 18l5.293-5.293Z"
			/>
		</svg>
	);
}

export function ArrowLeftIcon(props: IconProps) {
	return (
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			{...props}
		>
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
	);
}

export function ArrowRightIcon(props: IconProps) {
	return (
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			{...props}
		>
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	);
}

export function ChevronDownIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="m5.47 9.265 1.06-1.06 5.47 5.47 5.47-5.47 1.06 1.06-6.53 6.53-6.53-6.53Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function PlusIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" fillRule="evenodd" d="M11.25 18.813v-14h1.5v14h-1.5Z" clipRule="evenodd" />
			<path fill="currentColor" fillRule="evenodd" d="M19 12.563H5v-1.5h14v1.5Z" clipRule="evenodd" />
		</svg>
	);
}

export function MinusIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" fillRule="evenodd" d="M19 12.75H5v-1.5h14v1.5Z" clipRule="evenodd" />
		</svg>
	);
}

export function TrashIcon(props: IconProps) {
	return (
		<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
			<path fill="currentColor" d="M10.75 17.75v-7.5h-1.5v7.5h1.5ZM14.75 17.75h-1.5v-7.5h1.5v7.5Z" />
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M7.25 5.25V4c0-.744.364-1.425.845-1.905.48-.48 1.161-.845 1.905-.845h4c.744 0 1.425.364 1.905.845.48.48.845 1.161.845 1.905v1.25h5v1.5h-2V20c0 .744-.364 1.425-.845 1.905-.48.48-1.161.845-1.905.845H7c-.744 0-1.425-.364-1.905-.845-.48-.48-.845-1.161-.845-1.905V6.75h-2v-1.5h5Zm1.5 0V4c0-.256.136-.575.405-.845.27-.27.589-.405.845-.405h4c.256 0 .575.136.845.405.27.27.405.589.405.845v1.25h-6.5Zm-3 1.5V20c0 .256.136.575.405.845.27.27.589.405.845.405h10c.256 0 .575-.136.845-.405.27-.27.405-.589.405-.845V6.75H5.75Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
