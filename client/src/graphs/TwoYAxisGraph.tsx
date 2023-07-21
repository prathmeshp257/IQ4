import React, { FC } from "react";
import { Bar, Line } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import { stackedTooltip } from "./helpers";
import { Color, Colors, FadedColors } from "../types";

interface TwoYAxisGraphProps {
	data: {
		labels?: string[];
		datasets: {
			values?: any[];
			yAxisID?:string;
			label?:string;
			color?:Color;
		}[];
	};
	height?: number;
	graphType?: string;
	leftTitle?: string;
	rightTitle?:string
}

export const TwoYAxisGraph: FC<TwoYAxisGraphProps> = ({
	data,
	height = isMobile ? 500 : 120,
	graphType = "bar",
	leftTitle,
	rightTitle
}) => {
	let total = 0;

	const graphProps = {
		redraw: false,
		height,
		responsive: true,
		legend: {
			display: true,
			labels: { padding: 20, boxWidth: 5, usePointStyle: true, fullWidth: false, fontSize: isMobile ? 10 : 10 }
		},
		options: {
			tooltips: stackedTooltip({ total, type:"" }),
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 20,
					bottom: 0
				}
			},
			scales: {
				xAxes: [
					{
						offset: false,
						gridLines: { drawOnChartArea: !isMobile, drawBorder: !isMobile },
						ticks: {
							display: true,
							fontSize: 10,
							max: 12,
							major: { enabled: true },
							minRotation: isMobile ? 35 : 0,
							maxRotation: isMobile ? 35 : 0,
							maxBarThickness: isMobile ? 15 : 30,
							maxTicksLimit: isMobile ? 5 : 12
						}
					}
				],
				left: {
					title: {
						display: true,
						text: leftTitle || "",
					},
					ticks: {
						beginAtZero: true,
					},
					position: "left",
				},
				right:{
					title: {
						display: true,
						text: rightTitle || "",
					},
					position: "right",
					ticks: {
						beginAtZero: true,
					},
					grid: {
						drawOnChartArea: false,
					},
				}
			}
		},
		data: {
			labels: data?.labels,
			datasets: data.datasets.map(({ values, label, yAxisID, color }) => {
				return {
					label,
					data: values?.map((value) => Number(value)),
					yAxisID: yAxisID,
					backgroundColor: color ? FadedColors[color] : FadedColors["yellow"],
					borderColor: color ? Colors[color] : Colors["yellow"],
				};
			})
		},
	};

	return (
		<div style={{ padding: !isMobile ? "16px 12px" : "0 16px 0 0" }}>
			{graphType === "bar" && <Bar type="bar" {...graphProps} />}
			{graphType === "line" && <Line type="line" {...graphProps} />}
		</div>
	);
};
