import React, { FC } from "react";

const getBarColor = (value: number) => {
	if (value > 0 && value <= 33) return "--bg-color-danger";
	if (value > 33 && value <= 66) return "--bg-color-warning";
	if (value > 66 && value <= 100) return "--bg-color-teal";
};

interface RatioBarProps {
	percentage: string | number | undefined;
	color: string;
}

export const RatioBar: FC<RatioBarProps> = ({ percentage, color }) => {
	return (
		<>
			<div
				className={`ratio-bar ${color || getBarColor(Number(percentage))}`}
				style={{ height: `${percentage}%` }}
			></div>
			<p className="ratio-bar__percentage">{`${percentage}%`}</p>
		</>
	);
};
