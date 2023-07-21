import dayjs from "dayjs";
import React, { FC } from "react";
import { DashCard } from "../DashCard";

interface SystemHealthRowProps {
	type: string;
	title: string;
	data?: any;
	className?: string;
}

export const SystemHealthRow: FC<SystemHealthRowProps> = ({ type, title, data, className = "" }) => {
	if (!data) return <></>;
	const {mot_execution_time, overAllMotData, motPending} = data;
	const {co2_execution_time, overAllCo2Data, co2Pending} = data;

	return (
		<div className={`system-health-row ${className}`}>
			<h3 className="system-health-row__title">{title}</h3>
			<div className="system-health-row__content">
				<DashCard
					title="Last Execution Date Time"
					titleColor="teal"
					value={type === "mot" ? dayjs(mot_execution_time).format("DD/MM/YYYY HH:mm:ss") : dayjs(co2_execution_time).format("DD/MM/YYYY HH:mm:ss")  }
					cardType = "health"
				/>
				<DashCard
					title="Database Success"
					titleColor="blue"
					value={type === "mot" ? overAllMotData?.mot_db_success : overAllCo2Data?.co2_db_success || 0}
					cardType = "health"
				/>
				<DashCard
					title="API Success"
					titleColor="orange"
					value={type === "mot" ? overAllMotData?.mot_api_success : overAllCo2Data?.co2_api_success || 0}
					cardType = "health"
				/>
				<DashCard
					title="API Failed"
					titleColor="danger"
					value={type === "mot" ? overAllMotData?.mot_api_failed : overAllCo2Data?.co2_api_failed || 0}
					cardType = "health"
				/>
				<DashCard
					title="Pending"
					titleColor="purple"
					value={type === "mot" ? motPending : co2Pending || 0}
					cardType = "health"
				/>
			</div>
		</div>
	);
};
