import React, { FC } from "react";
import { Bar, Line } from "react-chartjs-2";
import { isMobile } from "react-device-detect";
import { Color, Colors, FadedColors } from "../types";
import { generateGraphProps, generateGraphStyle } from "./helpers";

interface ReportGraphProps {
	data: {
		labels?: string[];
		datasets: {
			values?: string[];
		}[];
	};
	id?:string;
	color: Color;
	secondaryColor?: Color;
	tertiaryColor?: Color;
	label: string;
	secondaryLabel?: string;
	tertiaryLabel?: string;
	type?: "Visits" | "Occupancy" | "Dwell" | "Repeat Entry Time" | "Repeat Frequency" | "Dwell By Hour";
	graphType?: "bar" | "line";
	stacked?: boolean;
}

export const ReportGraph: FC<ReportGraphProps> = ({
	data,
	id,
	color,
	secondaryColor = "gray",
	tertiaryColor = "dark",
	label,
	secondaryLabel,
	tertiaryLabel,
	type = "Visits",
	graphType = "bar",
	stacked = false
}) => {
	let total = 0;

	const graphProps = {
		...generateGraphProps({
			height: isMobile ? 270 : 80,
			total,
			type,
			stacked,
			displayLegend: !isMobile && stacked,
			displayLabelAxisX: !isMobile,
			displayLabelAxisY: !isMobile,
			redraw: false,
			labelSpacingAxisX: isMobile ? 50 : 30,
			labelSpacingAxisY: isMobile ? 40 : 80,
			offsetX: true
		}),
		data: {
			labels: data?.labels,
			datasets: data.datasets.map(({ values }, idx) => {
				return {
					...generateGraphStyle({
						index: idx,
						border: 1,
						isOverlayed: false,
						type: label as "Occupancy" | "Visits" | "Dwell"
					}),
					borderColor: idx === 0 ? Colors[color] : idx === 1 ? Colors[secondaryColor] : Colors[tertiaryColor],
					pointBorderColor: idx === 0 ? Colors[color] : idx === 1 ? Colors[secondaryColor] : Colors[tertiaryColor],
					pointBackgroundColor: idx === 0 ? Colors[color] : idx === 1 ? Colors[secondaryColor] : Colors[tertiaryColor],
					backgroundColor: idx === 0 ? FadedColors[color] : idx === 1 ? FadedColors[secondaryColor] : Colors[tertiaryColor],
					label: idx === 0 ? label : idx === 1 ? secondaryLabel : tertiaryLabel,
					data: values?.map((value) => Number(value))
				};
			})
		}
	};

	const legendProps = {
		...graphProps.legend,
		position: (isMobile ? "bottom" : "left") as "top" | "left" | "right" | "bottom" | "chartArea" | undefined,
		align: "start" as "start" | "end" | "center"
	};

	return (
		<div style={{ padding: !isMobile ? "16px 12px" : "0 16px 0 0" }}>
			{graphType === "bar" && <Bar id={id ? id :'bar'} type='bar' {...graphProps} options={legendProps} />}
			{graphType === "line" && <Line  id={id ? id :'line'} type='line' {...graphProps} options={legendProps} />}
		</div>
	);
};
