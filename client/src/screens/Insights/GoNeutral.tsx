import React, { FC, useState } from "react";
import { CardWithTabs, Flex } from "../../components";
import { Shell } from "../../containers";
import { LabelledComponent } from "../../components/LabelledComponent";
import RowLayoutIcon from "@material-ui/icons/Menu";
import ColumnLayoutIcon from "@material-ui/icons/ViewWeek";
import { Switch } from "antd";
import { isMobile } from "react-device-detect";
import { About } from './About';
import { Project1 } from './Project1';
import { Project2 } from './Project2';
import { CalculateAndOffset } from "./CalculateAndOffset";
import { ArchivedCO2Stats } from "./ArchivedCO2Stats";

export const GoNeutral: FC = () => {
	const isLocalContainerColMode = (localStorage.getItem("goNeutral-layout-mode") || "row") === "col";
	const [activeLabel, setActiveLabel] = useState<string>("About");
	const [isContainerColMode, setIsContainerColMode] = useState(isLocalContainerColMode);

	return (
	
        <CardWithTabs
            style={{height:'100%'}}
	    	key={activeLabel}
	    	activeLabel={activeLabel || "About"}
	    	title={activeLabel}
	    	onItemClick={({label}) => setActiveLabel(label)}
	    	tabColor="dark"
	    	isOpen
	    	items={[
	    		{
	    			label: "About",
	    			value: "About",
	    			content: (
                        <>
                            <About />
                        </>
                    )
	    		},
	    		{
	    			label: "Project 1",
	    			value: "Project 1",
	    			content: (
                        <>
                            <Project1 />
                        </>
                    )
	    		},
	    		{
	    			label: "Project 2",
	    			value: "Project 2",
	    			content: (
                        <>
                            <Project2 />
                        </>
                    )
	    		},
	    		{
	    			label: "Calculate & Offset",
	    			value: "Calculate & Offset",
	    			content: (
                        <>
                            <CalculateAndOffset isContainerColMode={isContainerColMode}/>
                        </>
                    )
	    		},
				{
	    			label: "Archived CO2 Stats",
	    			value: "Archived CO2 Stats",
	    			content: (
                        <>
                            <ArchivedCO2Stats isContainerColMode={isContainerColMode}/>
                        </>
                    )
	    		}
            ]}
        />
     
	);
};
