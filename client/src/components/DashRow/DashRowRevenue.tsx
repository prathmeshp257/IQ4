

import dayjs from "dayjs";
import React, { FC, useContext, useState } from "react";
import { LiveObject } from "../../types";
import { DashCard } from "../DashCard";
import { AuthContext } from "../../context";
import { Formatter } from "../../utils";
import PropTypes from 'prop-types';
import { DashCardRevenue } from "../DashCard/DashCardRevenue";
import { ViewRevenue } from "../../screens/Insights/RevenueSummary.tsx";
import { Button, Flex } from "../../components";
import CSVIcon from "@material-ui/icons/Assessment";


interface DashRowProps {
	tariffName: string;
	title: string;
	subTitle: string;
	data?: any;
	className?: string;
	mode?: string;
}

export const DashRowRevenue: FC<DashRowProps> = ({ tariffName, title, data, subTitle, className = "", mode  }) => {
	const { userData } = useContext(AuthContext)
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dataByTime,setDataByTime] = useState<any>({});
	const [totalResponse,setTotalResponse] = useState<any>({});

	// if (!data) return <></>;
	const handleCardClick = (type:any) => {
		setIsDialogOpen(true);
		
        if(type == 'daily'){
		  setDataByTime(data  ? data['1Day'] : '')
	    }
		else if(type == 'weekly'){
		  setDataByTime(data ? data['7Days'] : '')
		}
		else if(type == 'monthly'){
		  setDataByTime(data  ? data['30Days'] : '')
		}
		else if(type == 'quaterly'){
		  setDataByTime(data  ? data['90Days'] : '')
		}
		else if(type == 'halfYearly'){
			setDataByTime(data  ? data['180Days'] : '')
		}
		else if(type == 'yearly'){
		    setDataByTime(data  ? data['365Days'] : '')
		}
	  };
	const handleClose = () => {
		setIsDialogOpen(false);
	  };
    
	const downloadCSV = () => {

		let formatData = [
			`${Formatter.capitalizeSite(data.site)},Daily,Weekly,Monthly,Quaterly,Half-Yearly,Yearly`,
			`Vehicle Entered,${data["1Day"] && data["1Day"].ins ? data["1Day"].ins : 0},${data["7Days"] && data["7Days"].ins ? data["7Days"].ins : 0},${data["30Days"] && data["30Days"].ins ? data["30Days"].ins : 0},${data["90Days"] && data["90Days"].ins ? data["90Days"].ins : 0},${data["180Days"] && data["180Days"].ins ? data["180Days"].ins : 0},${data["365Days"] && data["365Days"].ins ? data["365Days"].ins : 0}`,
			`Vehicle Exited,${data["1Day"] && data["1Day"].outs ? data["1Day"].outs : 0},${data["7Days"] && data["7Days"].outs ? data["7Days"].outs : 0},${data["30Days"] && data["30Days"].outs ? data["30Days"].outs : 0},${data["90Days"] && data["90Days"].outs ? data["90Days"].outs : 0},${data["180Days"] && data["180Days"].outs ? data["180Days"].outs : 0},${data["365Days"] && data["365Days"].outs ? data["365Days"].outs : 0}`,
			
			
			`Free EV Vehicle Count,${data["1Day"] && data["1Day"].freeEvVehicleCount ? data["1Day"].freeEvVehicleCount : 0},${data["7Days"] && data["7Days"].freeEvVehicleCount ? data["7Days"].freeEvVehicleCount : 0},${data["30Days"] && data["30Days"].freeEvVehicleCount ? data["30Days"].freeEvVehicleCount : 0},${data["90Days"] && data["90Days"].freeEvVehicleCount ? data["90Days"].freeEvVehicleCount : 0},${data["180Days"] && data["180Days"].freeEvVehicleCount ? data["180Days"].freeEvVehicleCount : 0},${data["365Days"] && data["365Days"].freeEvVehicleCount ? data["365Days"].freeEvVehicleCount : 0}`,
			`Free EV Vehicle Amount {£},${data["1Day"] && data["1Day"].freeEvVehicleAmount ? data["1Day"].freeEvVehicleAmount : 0},${data["7Days"] && data["7Days"].freeEvVehicleAmount ? data["7Days"].freeEvVehicleAmount : 0},${data["30Days"] && data["30Days"].freeEvVehicleAmount ? data["30Days"].freeEvVehicleAmount : 0},${data["90Days"] && data["90Days"].freeEvVehicleAmount ? data["90Days"].freeEvVehicleAmount : 0},${data["180Days"] && data["180Days"].freeEvVehicleAmount ? data["180Days"].freeEvVehicleAmount : 0},${data["365Days"] && data["365Days"].freeEvVehicleAmount ? data["365Days"].freeEvVehicleAmount : 0}`,
			
			`EV Vehicle within No Return,${data["1Day"] && data["1Day"].evVehiclehicleWithinNoReturnCount ? data["1Day"].evVehiclehicleWithinNoReturnCount : 0},${data["7Days"] && data["7Days"].evVehiclehicleWithinNoReturnCount ? data["7Days"].evVehiclehicleWithinNoReturnCount : 0},${data["30Days"] && data["30Days"].evVehiclehicleWithinNoReturnCount ? data["30Days"].evVehiclehicleWithinNoReturnCount : 0},${data["90Days"] && data["90Days"].evVehiclehicleWithinNoReturnCount ? data["90Days"].evVehiclehicleWithinNoReturnCount : 0},${data["180Days"] && data["180Days"].evVehiclehicleWithinNoReturnCount ? data["180Days"].evVehiclehicleWithinNoReturnCount : 0},${data["365Days"] && data["365Days"].evVehiclehicleWithinNoReturnCount ? data["365Days"].evVehiclehicleWithinNoReturnCount : 0}`,
			`EV Vehicle within No Return Amount {£},${data["1Day"] && data["1Day"].evVehiclehicleWithinNoReturnAmount ? data["1Day"].evVehiclehicleWithinNoReturnAmount : 0},${data["7Days"] && data["7Days"].evVehiclehicleWithinNoReturnAmount ? data["7Days"].evVehiclehicleWithinNoReturnAmount : 0},${data["30Days"] && data["30Days"].evVehiclehicleWithinNoReturnAmount ? data["30Days"].evVehiclehicleWithinNoReturnAmount : 0},${data["90Days"] && data["90Days"].evVehiclehicleWithinNoReturnAmount ? data["90Days"].evVehiclehicleWithinNoReturnAmount : 0},${data["180Days"] && data["180Days"].evVehiclehicleWithinNoReturnAmount ? data["180Days"].evVehiclehicleWithinNoReturnAmount : 0},${data["365Days"] && data["365Days"].evVehiclehicleWithinNoReturnAmount ? data["365Days"].evVehiclehicleWithinNoReturnAmount : 0}`,
			
			`Total Gasoline Vehicle Count,${data["1Day"] && data["1Day"].totalOtherVehicleCount ? data["1Day"].totalOtherVehicleCount : 0},${data["7Days"] && data["7Days"].totalOtherVehicleCount ? data["7Days"].totalOtherVehicleCount : 0},${data["30Days"] && data["30Days"].totalOtherVehicleCount ? data["30Days"].totalOtherVehicleCount : 0},${data["90Days"] && data["90Days"].totalOtherVehicleCount ? data["90Days"].totalOtherVehicleCount : 0},${data["180Days"] && data["180Days"].totalOtherVehicleCount ? data["180Days"].totalOtherVehicleCount : 0},${data["365Days"] && data["365Days"].totalOtherVehicleCount ? data["365Days"].totalOtherVehicleCount : 0}`,
			`Total Gasoline Vehicle Amount {£},${data["1Day"] && data["1Day"].totalOtherVehicleAmount ? data["1Day"].totalOtherVehicleAmount : 0},${data["7Days"] && data["7Days"].totalOtherVehicleAmount ? data["7Days"].totalOtherVehicleAmount : 0},${data["30Days"] && data["30Days"].totalOtherVehicleAmount ? data["30Days"].totalOtherVehicleAmount : 0},${data["90Days"] && data["90Days"].totalOtherVehicleAmount ? data["90Days"].totalOtherVehicleAmount : 0},${data["180Days"] && data["180Days"].totalOtherVehicleAmount ? data["180Days"].totalOtherVehicleAmount : 0},${data["365Days"] && data["365Days"].totalOtherVehicleAmount ? data["365Days"].totalOtherVehicleAmount : 0}`,
			
			`Gasoline Vehicle Count(Free),${data["1Day"] && data["1Day"].otherFreeVehicleCount ? data["1Day"].otherFreeVehicleCount : 0},${data["7Days"] && data["7Days"].otherFreeVehicleCount ? data["7Days"].otherFreeVehicleCount : 0},${data["30Days"] && data["30Days"].otherFreeVehicleCount ? data["30Days"].otherFreeVehicleCount : 0},${data["90Days"] && data["90Days"].otherFreeVehicleCount ? data["90Days"].otherFreeVehicleCount : 0},${data["180Days"] && data["180Days"].otherFreeVehicleCount ? data["180Days"].otherFreeVehicleCount : 0},${data["365Days"] && data["365Days"].otherFreeVehicleCount ? data["365Days"].otherFreeVehicleCount : 0}`,
			`Gasoline Vehicle Amount(Free) {£},${data["1Day"] && data["1Day"].otherFreeVehicleAmount ? data["1Day"].otherFreeVehicleAmount : 0},${data["7Days"] && data["7Days"].otherFreeVehicleAmount ? data["7Days"].otherFreeVehicleAmount : 0},${data["30Days"] && data["30Days"].otherFreeVehicleAmount ? data["30Days"].otherFreeVehicleAmount : 0},${data["90Days"] && data["90Days"].otherFreeVehicleAmount ? data["90Days"].otherFreeVehicleAmount : 0},${data["180Days"] && data["180Days"].otherFreeVehicleAmount ? data["180Days"].otherFreeVehicleAmount : 0},${data["365Days"] && data["365Days"].otherFreeVehicleAmount ? data["365Days"].otherFreeVehicleAmount : 0}`,
			
			`Gasoline Vehicle Count(No Return),${data["1Day"] && data["1Day"].otherVehicleWithinNoReturnCount ? data["1Day"].otherVehicleWithinNoReturnCount : 0},${data["7Days"] && data["7Days"].otherVehicleWithinNoReturnCount ? data["7Days"].otherVehicleWithinNoReturnCount : 0},${data["30Days"] && data["30Days"].otherVehicleWithinNoReturnCount ? data["30Days"].otherVehicleWithinNoReturnCount : 0},${data["90Days"] && data["90Days"].otherVehicleWithinNoReturnCount ? data["90Days"].otherVehicleWithinNoReturnCount : 0},${data["180Days"] && data["180Days"].otherVehicleWithinNoReturnCount ? data["180Days"].otherVehicleWithinNoReturnCount : 0},${data["365Days"] && data["365Days"].otherVehicleWithinNoReturnCount ? data["365Days"].otherVehicleWithinNoReturnCount : 0}`,
			`Gasoline Vehicle Amount(No Return) {£},${data["1Day"] && data["1Day"].otherVehicleWithinNoReturnAmount ? data["1Day"].otherVehicleWithinNoReturnAmount : 0},${data["7Days"] && data["7Days"].otherVehicleWithinNoReturnAmount ? data["7Days"].otherVehicleWithinNoReturnAmount : 0},${data["30Days"] && data["30Days"].otherVehicleWithinNoReturnAmount ? data["30Days"].otherVehicleWithinNoReturnAmount : 0},${data["90Days"] && data["90Days"].otherVehicleWithinNoReturnAmount ? data["90Days"].otherVehicleWithinNoReturnAmount : 0},${data["180Days"] && data["180Days"].otherVehicleWithinNoReturnAmount ? data["180Days"].otherVehicleWithinNoReturnAmount : 0},${data["365Days"] && data["365Days"].otherVehicleWithinNoReturnAmount ? data["365Days"].otherVehicleWithinNoReturnAmount : 0}`,

			`Total EV Vehicle Count,${data["1Day"] && data["1Day"].totalEvVehicleCount ? data["1Day"].totalEvVehicleCount : 0},${data["7Days"] && data["7Days"].totalEvVehicleCount ? data["7Days"].totalEvVehicleCount : 0},${data["30Days"] && data["30Days"].totalEvVehicleCount ? data["30Days"].totalEvVehicleCount : 0},${data["90Days"] && data["90Days"].totalEvVehicleCount ? data["90Days"].totalEvVehicleCount : 0},${data["180Days"] && data["180Days"].totalEvVehicleCount ? data["180Days"].totalEvVehicleCount : 0},${data["365Days"] && data["365Days"].totalEvVehicleCount ? data["365Days"].totalEvVehicleCount : 0}`,
			`Total EV Vehicle Amount {£},${data["1Day"] && data["1Day"].totalEvVehicleAmount ? data["1Day"].totalEvVehicleAmount : 0},${data["7Days"] && data["7Days"].totalEvVehicleAmount ? data["7Days"].totalEvVehicleAmount : 0},${data["30Days"] && data["30Days"].totalEvVehicleAmount ? data["30Days"].totalEvVehicleAmount : 0},${data["90Days"] && data["90Days"].totalEvVehicleAmount ? data["90Days"].totalEvVehicleAmount : 0},${data["180Days"] && data["180Days"].totalEvVehicleAmount ? data["180Days"].totalEvVehicleAmount : 0},${data["365Days"] && data["365Days"].totalEvVehicleAmount ? data["365Days"].totalEvVehicleAmount : 0}`,
			
			`Overnight EV Vehicle Count,${data["1Day"] && data["1Day"].overnightEvVehicleCount ? data["1Day"].overnightEvVehicleCount : 0},${data["7Days"] && data["7Days"].overnightEvVehicleCount ? data["7Days"].overnightEvVehicleCount : 0},${data["30Days"] && data["30Days"].overnightEvVehicleCount ? data["30Days"].overnightEvVehicleCount : 0},${data["90Days"] && data["90Days"].overnightEvVehicleCount ? data["90Days"].overnightEvVehicleCount : 0},${data["180Days"] && data["180Days"].overnightEvVehicleCount ? data["180Days"].overnightEvVehicleCount : 0},${data["365Days"] && data["365Days"].overnightEvVehicleCount ? data["365Days"].overnightEvVehicleCount : 0}`,
			`Overnight EV Vehicle Amount {£},${data["1Day"] && data["1Day"].overnightEvVehicleAmount ? data["1Day"].overnightEvVehicleAmount : 0},${data["7Days"] && data["7Days"].overnightEvVehicleAmount ? data["7Days"].overnightEvVehicleAmount : 0},${data["30Days"] && data["30Days"].overnightEvVehicleAmount ? data["30Days"].overnightEvVehicleAmount : 0},${data["90Days"] && data["90Days"].overnightEvVehicleAmount ? data["90Days"].overnightEvVehicleAmount : 0},${data["180Days"] && data["180Days"].overnightEvVehicleAmount ? data["180Days"].overnightEvVehicleAmount : 0},${data["365Days"] && data["365Days"].overnightEvVehicleAmount ? data["365Days"].overnightEvVehicleAmount : 0}`,

			`Overnight Gasoline Vehicle Count,${data["1Day"] && data["1Day"].overnightOtherVehicleCount ? data["1Day"].overnightOtherVehicleCount : 0},${data["7Days"] && data["7Days"].overnightOtherVehicleCount ? data["7Days"].overnightOtherVehicleCount : 0},${data["30Days"] && data["30Days"].overnightOtherVehicleCount ? data["30Days"].overnightOtherVehicleCount : 0},${data["90Days"] && data["90Days"].overnightOtherVehicleCount ? data["90Days"].overnightOtherVehicleCount : 0},${data["180Days"] && data["180Days"].overnightOtherVehicleCount ? data["180Days"].overnightOtherVehicleCount : 0},${data["365Days"] && data["365Days"].overnightOtherVehicleCount ? data["365Days"].overnightOtherVehicleCount : 0}`,			
			`Overnight Gasoline Vehicle Amount{£} ,${data["1Day"] && data["1Day"].overnightOtherVehicleAmount ? data["1Day"].overnightOtherVehicleAmount : 0},${data["7Days"] && data["7Days"].overnightOtherVehicleAmount ? data["7Days"].overnightOtherVehicleAmount : 0},${data["30Days"] && data["30Days"].overnightOtherVehicleAmount ? data["30Days"].overnightOtherVehicleAmount : 0},${data["90Days"] && data["90Days"].overnightOtherVehicleAmount ? data["90Days"].overnightOtherVehicleAmount : 0},${data["180Days"] && data["180Days"].overnightOtherVehicleAmount ? data["180Days"].overnightOtherVehicleAmount : 0},${data["365Days"] && data["365Days"].overnightOtherVehicleAmount ? data["365Days"].overnightOtherVehicleAmount : 0}`,			
			
			`EV Vehicle Count(Grace),${data["1Day"] && data["1Day"].evVehicleGraceCount ? data["1Day"].evVehicleGraceCount : 0},${data["7Days"] && data["7Days"].evVehicleGraceCount ? data["7Days"].evVehicleGraceCount : 0},${data["30Days"] && data["30Days"].evVehicleGraceCount ? data["30Days"].evVehicleGraceCount : 0},${data["90Days"] && data["90Days"].evVehicleGraceCount ? data["90Days"].evVehicleGraceCount : 0},${data["180Days"] && data["180Days"].evVehicleGraceCount ? data["180Days"].evVehicleGraceCount : 0},${data["365Days"] && data["365Days"].evVehicleGraceCount ? data["365Days"].evVehicleGraceCount : 0}`,
			`Gasoline Vehicle Count(Grace),${data["1Day"] && data["1Day"].otherVehicleGraceCount ? data["1Day"].otherVehicleGraceCount : 0},${data["7Days"] && data["7Days"].otherVehicleGraceCount ? data["7Days"].otherVehicleGraceCount : 0},${data["30Days"] && data["30Days"].otherVehicleGraceCount ? data["30Days"].otherVehicleGraceCount : 0},${data["90Days"] && data["90Days"].otherVehicleGraceCount ? data["90Days"].otherVehicleGraceCount : 0},${data["180Days"] && data["180Days"].otherVehicleGraceCount ? data["180Days"].otherVehicleGraceCount : 0},${data["365Days"] && data["365Days"].otherVehicleGraceCount ? data["365Days"].otherVehicleGraceCount : 0}`,
			`VRMs with Season Pass,${data["1Day"] && data["1Day"].vrmWithSeasonPass ? data["1Day"].vrmWithSeasonPass : 0},${data["7Days"] && data["7Days"].vrmWithSeasonPass ? data["7Days"].vrmWithSeasonPass : 0},${data["30Days"] && data["30Days"].vrmWithSeasonPass ? data["30Days"].vrmWithSeasonPass : 0},${data["90Days"] && data["90Days"].vrmWithSeasonPass ? data["90Days"].vrmWithSeasonPass : 0},${data["180Days"] && data["180Days"].vrmWithSeasonPass ? data["180Days"].vrmWithSeasonPass : 0},${data["365Days"] && data["365Days"].vrmWithSeasonPass ? data["365Days"].vrmWithSeasonPass : 0}`,
		]
	
		let b = formatData.join("\n")
		const blob = new Blob([b], { type: 'text/csv' });
  
		// Creating an object for downloading url
		const url = window.URL.createObjectURL(blob)
	
		// Creating an anchor(a) tag of HTML
		const a = document.createElement('a')
	
		// Passing the blob downloading url 
		a.setAttribute('href', url)
	
		// Setting the anchor tag attribute for downloading
		// and passing the download file name
		a.setAttribute(`download`, `${Formatter.capitalizeSite(data.site)}.csv`);
	
		// Performing a download with click
		a.click()

	} 
	  
	return (
		<div className={`dash-row ${className}`}>
			<Flex justify="space-between" wrap="wrap">
				<div>
				<h3 className="dash-row__title">{(tariffName.charAt(0).toUpperCase() + tariffName.slice(1))}</h3>
			        <h3 className="dash-row__title">{(title.charAt(0).toUpperCase() + title.slice(1)).replaceAll("-"," ")}</h3>
			        <h4>{subTitle}</h4>         
				</div>
				<div>
					<h4>Download</h4>
					<Button
				        text="CSV"
				        variant="filled"
				        // disabled={selectedSites.length === 0 || (!!!fromDate && !!!toDate)}
				        icon={<CSVIcon />}
				        // loading={downloadingCSV}
				        buttonStyle={{ marginRight: 5, minWidth: 80, maxWidth: 80 }}
				        onClick={downloadCSV}
			        />
				</div>
			
			</Flex>
			

			<div className="dash-row__content">
               
				{data && data['1Day'] ? <div><DashCardRevenue
					title="Daily"
					value={ `£ ${(data['1Day'].totalOtherVehicleAmount + data['1Day'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="blue" 
					onClick={()=>handleCardClick('daily')}
					/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>} 

				{data && data['7Days'] ? <div><DashCardRevenue
					title="Weekly"
					value={ `£ ${(data['7Days'].totalOtherVehicleAmount + data['7Days'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="danger"
					onClick={()=>handleCardClick('weekly')}
				/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>}

				{data && data['30Days'] ? <div><DashCardRevenue
					title="Monthly"
					value={ `£ ${(data['30Days'].totalOtherVehicleAmount + data['30Days'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="purple"
					onClick={()=>handleCardClick('monthly')}
				/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>}

				{data && data['90Days'] ? <div><DashCardRevenue
					title="quaterly"
					value={ `£ ${(data['90Days'].totalOtherVehicleAmount + data['90Days'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="teal"
					onClick={()=>handleCardClick('quaterly')}
				/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>}

				{data && data['180Days'] ? <div><DashCardRevenue
					title="Half Yearly"
					value={ `£ ${(data['180Days'].totalOtherVehicleAmount + data['180Days'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="secondary"
					onClick={()=>handleCardClick('halfYearly')}
				/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>}

				{data && data['365Days'] ? <div><DashCardRevenue
					title="Yearly"
					value={ `£ ${(data['365Days'].totalOtherVehicleAmount + data['365Days'].totalEvVehicleAmount).toLocaleString('en-US', { minimumFractionDigits: 1 })} `} 
					titleColor="secondary"
					onClick={()=>handleCardClick('yearly')}
				/>
                <ViewRevenue open={isDialogOpen} onClose={handleClose} viewData={dataByTime} title={data.tariffName}/></div> : <></>}


			</div>
		</div>
	);
};
