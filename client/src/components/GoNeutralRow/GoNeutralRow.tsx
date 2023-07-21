import React, { FC } from "react";
import { DashCard } from "../DashCard";

interface GoNeutralRowProps {
	title: string;
	data?: any;
	className?: string;
}

export const GoNeutralRow: FC<GoNeutralRowProps> = ({ title, data, className = "" }) => {
	if (!data) return <></>;
	const { currentMonthCo2, lastMonthCo2, currentYearCo2, lifetimeCo2Usage, currentMonthOffset, lastMonthOffset, currentYearOffset, lifetimeOffset } = data;

	return (
		<div className={`go-neutral-row ${className}`}>
			<h3 className="go-neutral-row__title">{title}</h3>
			<h6 className="go-neutral-row__subtitle">Total tCO²e Usage</h6>
			<div className="go-neutral-row__content">
				<DashCard
					title="Current Month"
					titleColor="teal"
					value={Number(currentMonthCo2).toFixed(2)}
					cardType = "iqStat"
				/>
				<DashCard
					title="Last Month"
					titleColor="blue"
					value={Number(lastMonthCo2).toFixed(2)}
					cardType = "iqStat"
				/>
				<DashCard
					title="Anually"
					titleColor="orange"
					value={Number(currentYearCo2).toFixed(2)}
					cardType = "iqStat"
				/>
				<DashCard
					title="Lifetime"
					titleColor="danger"
					value={Number(lifetimeCo2Usage).toFixed(2)}
					cardType = "iqStat"
				/>
			</div>
			<h6 className="go-neutral-row__subtitle">Cost For Offsetting tCO²e Usage</h6>
			<div className="go-neutral-row__content">
				<DashCard
					title="Current Month"
					titleColor="teal"
					value={`£${Number(currentMonthOffset).toFixed(2)}`}
					cardType = "iqStat"
				/>
				<DashCard
					title="Last Month"
					titleColor="blue"
					value={`£${Number(lastMonthOffset).toFixed(2)}`}
					cardType = "iqStat"
				/>
				<DashCard
					title="Anually"
					titleColor="orange"
					value={`£${Number(currentYearOffset).toFixed(2)}`}
					cardType = "iqStat"
				/>
				<DashCard
					title="Lifetime"
					titleColor="danger"
					value={`£${Number(lifetimeOffset).toFixed(2)}`}
					cardType = "iqStat"
				/>
			</div>
		</div>
	);
};
