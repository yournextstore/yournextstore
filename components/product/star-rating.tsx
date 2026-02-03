import { MaterialIcon } from "@/components/icons/material-icon";

type StarRatingProps = {
	rating: number;
	className?: string;
};

export function StarRating({ rating, className = "" }: StarRatingProps) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className={`flex ${className}`}>
			{Array.from({ length: fullStars }).map((_, i) => (
				<MaterialIcon key={`full-${i}`} name="star" className="text-yellow-400 text-sm" />
			))}
			{hasHalfStar && <MaterialIcon name="star_half" className="text-yellow-400 text-sm" />}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<MaterialIcon key={`empty-${i}`} name="star" className="text-gray-300 text-sm" />
			))}
		</div>
	);
}
