import React, { FC } from "react";
import { DashCard } from "../DashCard";

interface IqStatsRowProps {
	title: string;
	data?: any;
	className?: string;
}

export const IqStatsRow: FC<IqStatsRowProps> = ({ title, data, className = "" }) => {
	if (!data) return <></>;
	const { totalIns, totalOuts, approxMatch, clusterMatch, exactMatch, noMatch, pendingMatch, invalid } = data;
	const { approxMatchPer, clusterMatchPer, exactMatchPer, invalidPer, noMatchPer, pendingMatchPer } = data;

	return (
		<div className={`iq-stats-row ${className}`}>
			<h3 className="iq-stats-row__title">{title}</h3>
			<div className="iq-stats-row__content">
				<DashCard
					title="Total In's"
					titleColor="teal"
					value={totalIns}
					cardType = "iqStat"
				/>
				<DashCard
					title="Total Out's"
					titleColor="blue"
					value={totalOuts}
					cardType = "iqStat"
				/>
				<DashCard
					title="Exact Match"
					titleColor="orange"
					value={exactMatch}
					ratio={exactMatchPer}
					cardType = "iqStat"
				/>
				<DashCard
					title="Cluster Match"
					titleColor="danger"
					value={clusterMatch}
					ratio={clusterMatchPer}
					cardType = "iqStat"
				/>
				<DashCard
					title="Approximate Match"
					titleColor="purple"
					value={approxMatch}
					ratio={approxMatchPer}
					cardType = "iqStat"
				/>
				<DashCard
					title="Match None"
					titleColor="purple"
					value={noMatch}
					ratio={noMatchPer}
					cardType = "iqStat"
				/>
				<DashCard
					title="Pending Match"
					titleColor="purple"
					value={pendingMatch}
					ratio={pendingMatchPer}
					cardType = "iqStat"
				/>
				<DashCard
					title="Invalid"
					titleColor="purple"
					value={invalid}
					ratio={invalidPer}
					cardType = "iqStat"
				/>
			</div>
		</div>
	);
};
