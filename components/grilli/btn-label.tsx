/** The rolling label of the original's buttons: the second copy slides in on hover. */
export function BtnLabel({ children }: { children: string }) {
	return (
		<>
			<span className="btn-label">{children}</span>
			<span className="btn-label btn-label-2" aria-hidden="true">
				{children}
			</span>
		</>
	);
}
