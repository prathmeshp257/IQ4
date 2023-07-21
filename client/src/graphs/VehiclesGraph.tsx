import { LegendItem } from "chart.js";
import React, { FC } from "react";
import { Bar } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import { Color, Colors, FadedColors } from "../types";
import { colors, colorsFaded, generateGraphProps, generateGraphStyle } from "./helpers";

interface Props {
	data: {
		labels: string[];
		datasets: {
			stack?: string;
			values: any[];
			label?: string;
		}[];
	};
	color: Color;
	label: string;
	labelAxisX?: string;
	labelAxisY?: string;
	height?: number;
	type?: "Make" | "Model" | "Age" | "Fuel" | "Emissions" | "CO2" | "Color" | "Valuations" | "EV-Total Visits" | "EV-Dwell Time By Hour" | "EV-Average Dwell Time" | "EV-Repeat Visits" | "Vehicle Type";
	stacked?: boolean;
	maxAxisY?: number;
	xAxisTitle?: string;
	yAxisTitle?:string
	labelSpacingAxisY?: number;
	displayLegend?: boolean;
	isHorizontal?: boolean;
}

export const VehiclesGraph: FC<Props> = ({
	data,
	color,
	label,
	height,
	type = "Make",
	stacked = false,
	displayLegend = false,
	labelAxisX,
	labelAxisY,
	xAxisTitle,
	yAxisTitle,
	labelSpacingAxisY = 150,
	maxAxisY,
	isHorizontal = true
}) => {
	let total = 0;

	const graphProps = {
		...generateGraphProps({
			height: height || 150,
			maxTicksY: isHorizontal ? 50 : 5,
			total,
			type,
			stacked,
			displayLegend,
			redraw: false,
			isHorizontal,
			labelAxisX,
			labelAxisY,
			maxAxisY,
			labelSpacingAxisX: labelAxisX ? (isMobile ? 60 : 70) : 40,
			labelSpacingAxisY: ["Make", "Model", "Emissions"].includes(type) ? labelSpacingAxisY : 80,
			offsetX: !isHorizontal
		}),
		data: {
			labels: data?.labels,
			datasets: data.datasets.map(({ values, label: datasetLabel, stack }, idx) => {
				return {
					...generateGraphStyle({
						index: idx,
						border: 1,
						isOverlayed: false,
						isHorizontal,
						type: label as "Make" | "Model" | "Age" | "Fuel" | "Emissions" | "CO2" | "Color" | "Valuations" | "EV-Total Visits" | "EV-Dwell Time By Hour" | "EV-Average Dwell Time" | "EV-Repeat Visits"
					}),
					borderColor: idx === 0 ? Colors[color] : colors[idx],
					pointBorderColor: idx === 0 ? Colors[color] : colors[idx],
					pointBackgroundColor: idx === 0 ? Colors[color] : colors[idx],
					backgroundColor: idx === 0 ? FadedColors[color] : colorsFaded[idx],
					label: datasetLabel === "averageEvPureDwell" || datasetLabel === "evPureVisits"  ? "EV Pure" : datasetLabel === "evHybridVisits" || datasetLabel === "averageEvHybridDwell" ? "EV Hybrid" : datasetLabel === "evAllVisits" || datasetLabel === "averageEvAllDwell" ? "EV All" : datasetLabel ? datasetLabel : label,
					data: values.map((value: any) => Number(value)),
					stack
				};
			})
		}
	};

	const legendProps = {

		...graphProps.legend,
		scales: {
			left: {
				title: {
					display: true,
					text:    yAxisTitle || "",
				},
				ticks: {
					beginAtZero: true,
					callback: function(value:any,index:any) {
						     
						            if(isHorizontal == true){
									    return String(data.labels[value]).substring(0,15);
					                }
									else{
										return value
									}
							   },
				},
				position: "left",
			},	
			bottom: {
				title: {
					display: true,
					text:   xAxisTitle || "",
				},
				ticks: {
					// beginAtZero: true,
				},
				position: "bottom",
			},
		},
		indexAxis: isHorizontal ? 'y' : 'x',
		position: (isMobile ? "bottom" : "left") as "top" | "left" | "right" | "bottom" | "chartArea" | undefined,
		align: "start" as "start" | "end" | "center",
		onClick: function (_: any, legendItem: LegendItem) {
			const index = legendItem.datasetIndex as number;
			const ci = ((this as any) as { chart: any }).chart as Chart;
			if(ci){
				const alreadyHidden = !ci.getDatasetMeta(index).hidden ? false : ci.getDatasetMeta(index).hidden;
	
				ci.data.datasets?.forEach(function (_: any, i: any) {
					const meta = ci.getDatasetMeta(i);
	
					if (i !== index) {
						if (!alreadyHidden) {
							meta.hidden = !meta.hidden ? !meta.hidden : false;
						} else if (meta.hidden === false) {
							meta.hidden = true;
						}
					} else if (i === index) {
						meta.hidden = false;
					}
				});
	
				ci.update();
			}
		}
	};
	

	return (
		<div style={{ padding: !isMobile ? "0px 12px" : "0 16px 0 0" }}>
			{ <Bar type='bar' {...graphProps} options={legendProps} /> }
		</div>
	);
	
};
