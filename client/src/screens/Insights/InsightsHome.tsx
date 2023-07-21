import React, { FC, useContext, useState } from "react";
import { CardWithTabs } from "../../components";
import { Shell } from "../../containers";
import { Insights } from "./Insights";
import { GoNeutral } from "./GoNeutral";
import { Calc } from "./P&DCal";
import { MainCal } from "./MainP&Dcal";
import { AuthContext } from "../../context/AuthContext";

export const InsightsHome: FC = () => {
	const { userData } = useContext(AuthContext);
	const userLoginType = userData.userType;
	const {pDCalculatorAccess , pDCalculatorAccessSites} = userData
    
	const [activeLabel, setActiveLabel] = useState<string>("Insights");

	const items = [{
		label: "Insights",
		value: "Insights",
		content: (
			<>
				<Insights />
			</>
		)
	},
	{
		label: "Go Neutral",
		value: "Go Neutral",
		content: (
			<>
				<GoNeutral />
			</>
		)
	},
	];


	if (userLoginType === "Admin" || (pDCalculatorAccess && pDCalculatorAccessSites && pDCalculatorAccessSites[0])) {
		items.push({
			label: "P & D Calculator",
			value: "P & D Calculator",
			content: (
				<>
					<MainCal />
				</>
			)
			
	})
    }







return (

	<Shell
		title="Insights"
		subtitle=""
	>
		<CardWithTabs
			style={{ height: '100%' }}
			key={activeLabel}
			activeLabel={activeLabel || "Insights"}
			title={activeLabel}
			onItemClick={({ label }) => setActiveLabel(label)}
			tabColor="dark"
			isOpen
			items={items}
		/>
	</Shell>

);
};
