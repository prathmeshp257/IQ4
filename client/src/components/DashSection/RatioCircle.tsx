import React, { FC } from "react";

const getCircleColor = (value: number) => {
	if (value > 0 && value <= 33) return "--bg-color-danger";
	if (value > 33 && value <= 66) return "--bg-color-warning";
	if (value > 66 && value <= 100) return "--bg-color-teal";
};

interface RatioCircleProps {
	percentage: string | number | undefined;
	color: string;
}

export const RatioCircle: FC<RatioCircleProps> = ({ percentage, color }) => {
	return (
		<>
			<div
				className={`ratio-circle ${color || getCircleColor(Number(percentage))}`}
				style={{
					height: `${percentage}%`,
					borderBottomRightRadius: 8,
					borderTopRightRadius: 8 - (100 - Number(percentage))
				}}
			></div>
			<p className="ratio-circle__percentage">{`${percentage}%`}</p>
		</>
	);
};
