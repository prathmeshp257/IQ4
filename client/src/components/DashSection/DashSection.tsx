import React, { FC } from "react";
import { RatioCircle } from "./RatioCircle";

interface DashSectionProps {
	title: string;
	value: string | number | undefined;
	type?: string;
	titleColor: string;
	ratio?: string | number | undefined;
	ratioColor?: string;
}

export const DashSection: FC<DashSectionProps> = ({ title, value, type, titleColor = "green", ratio, ratioColor }) => {
	return (
		<div className={`dash-section dash-section__variant-${ratio != null ? "default" : "compact"}`}>
			<div className={`dash-section__main-${ratio ? "default" : "compact"}`}>
				<h4 className={`dash-section__title--${titleColor} --no-margin`}>{title}</h4>
				<div className="dash-section__content">
					<h2 className="dash-section__value --no-margin">{value}</h2>
					{type && <span className="dash-section__type --no-margin">{type}</span>}
				</div>
			</div>
			{ratio != null && (
				<div className="dash-section__ratio">
					<RatioCircle percentage={ratio} color={ratioColor || ""} />
				</div>
			)}
		</div>
	);
};
