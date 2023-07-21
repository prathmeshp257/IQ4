import dayjs from "dayjs";
import React, { FC, useContext } from "react";
import { LiveObject } from "../../types";
import { DashCard } from "../DashCard";
import { AuthContext } from "../../context";
import { Formatter } from "../../utils";

interface DashRowProps {
	title: string;
	data?: LiveObject;
	className?: string;
	mode?:string;
}

export const DashRow: FC<DashRowProps> = ({ title, data, className = "", mode }) => {
	const { userData } = useContext(AuthContext);
	if (!data) return <></>;

	const { all, unique, repeat, dwell, live, diff } = data;
	const hasBasicOccupancyAccess = userData.userType === "Admin" || (userData.basicOccupancyAccess && userData.basicOccupancyAccessSites.includes(Formatter.normalizeSite(title)))
    const hasOccupancyProAccess = userData.userType === "Admin" || (userData.occupancyProAccess && userData.occupancyProAccessSites.includes(Formatter.normalizeSite(title)))
	const hasOccupancy24hAccess = userData.userType === "Admin" || (userData.occupancy24hAccess && userData.occupancy24hAccessSites.includes(Formatter.normalizeSite(title)))
	return (
		<div className={`dash-row ${className}`}>
			<h3 className="dash-row__title">{title}</h3>
			<div className="dash-row__content">
			{ hasOccupancyProAccess && 	<DashCard
					cardType="live"
					mode={mode}
					title="Occupancy Pro"
					value={`${live?.current}/${live?.capacity}`}
					titleColor="teal"
					diff={diff?.occupancy || undefined}
					tooltip={`Compared to ${dayjs().subtract(1, "day").format("DD MMM [at] HH:mm")}`}
				/>}
				{ 
					hasBasicOccupancyAccess ?
						<DashCard
							cardType="live"
							mode={mode}
							title="Basic Occupancy"
							value={`${live?.basicOccupancy || 0}/${live?.capacity}`}
							titleColor="success"
						/>
					: ""
				}
				<DashCard
					cardType="live"
					mode={mode}
					title="Total Visits"
					value={all?.count}
					type="vehicles"
					titleColor="blue"
					diff={diff?.visits || undefined}
					tooltip={`Compared to ${dayjs().subtract(1, "day").format("DD MMM [at] HH:mm")}`}
				/>
				<DashCard
					cardType="live"
					mode={mode}
					title="Unique Visits"
					value={unique?.count}
					type="vehicles"
					titleColor="orange"
					ratio={unique?.ratio}
					ratioColor="--bg-color-orange"
				/>
				<DashCard
					cardType="live"
					mode={mode}
					title="Repeat Visits"
					value={repeat?.count}
					type="vehicles"
					titleColor="danger"
					ratio={repeat?.ratio}
					ratioColor="--bg-color-danger"
				/>
				<DashCard 
					cardType="live"
					mode={mode}
					title="Dwell time (average)" 
					value={dwell?.average} 
					type="minutes" 
					titleColor="purple" 
				/>
				{ 
					hasOccupancy24hAccess ?
						<DashCard
							cardType="live"
							mode={mode}
							title="Occupancy 24h"
							value={`${live?.occupancy24h}/${live?.capacity}`}
							titleColor="success"
						/>
					: ""
				}
			</div>
		</div>
	);
};
